import { UUID, Int32 } from "bson";
import { randomUUID } from "crypto";
import { Collection, Db, Filter } from "mongodb";
import { createMaybeConverter } from "../../utils/create-maybe-converter";
import { InsertInput, Query, Repo } from "./base-repo";
import { db } from "../db/client";

type DSCount = {
  _id: UUID;
  value: Int32;
};

export type Count = {
  id: string;
  value: number;
};

type CountQuery = Query<Count>;

type DSCountQuery = Filter<DSCount>;

const convertMaybeUUID = createMaybeConverter<string, UUID>((a) => new UUID(a));
const convertMaybeInt32 = createMaybeConverter<number, Int32>(
  (a) => new Int32(a)
);

class ExampleRepo implements Repo<Count> {
  private datasource: Collection<DSCount>;

  constructor(db: Db) {
    this.datasource = db.collection("counts");
  }

  private async fromDomainToDS(count: Count): Promise<DSCount> {
    const dsCount: DSCount = {
      _id: new UUID(count.id),
      value: new Int32(count.value)
    };

    return dsCount;
  }

  private async fromDSToDomain(dsCount: DSCount): Promise<Count> {
    const count: Count = {
      id: dsCount._id.toString(),
      value: dsCount.value.value
    };

    return count;
  }

  private async fromDomainQueryToDSQuery(
    query: CountQuery
  ): Promise<DSCountQuery> {
    const dsQuery: DSCountQuery = {
      _id: convertMaybeUUID(query.id),
      value: convertMaybeInt32(query.value)
    };

    return dsQuery;
  }

  public async insertOne(count: InsertInput<Count>): Promise<Count> {
    const dsCount = await this.fromDomainToDS({
      id: randomUUID(),
      ...count
    });

    const result = await this.datasource.insertOne(dsCount);
    if (!result.acknowledged) throw new Error("Failed to insert count");

    const createdUser = await this.datasource.findOne({
      _id: result.insertedId
    });

    if (!createdUser)
      throw new Error("Failed to get count after inserting. This is a fluke.");

    return await this.fromDSToDomain(createdUser);
  }

  public async findOne(query: Query<Count>): Promise<Count | undefined> {
    const dsCount = await this.datasource.findOne(
      this.fromDomainQueryToDSQuery(query)
    );

    return dsCount ? this.fromDSToDomain(dsCount) : undefined;
  }

  public async updateOne(filter: Partial<Count>): Promise<Count> {
    throw new Error("Not implemented");
  }
}

export const exampleRepo = new ExampleRepo(db.db("count"));
