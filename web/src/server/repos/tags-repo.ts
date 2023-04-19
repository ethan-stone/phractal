import { type Tag } from "@/server/domain/tag";
import { type Overwrite } from "../utils/types";
import { type Db, type Collection } from "mongodb";
import { uid } from "../utils/uid";

export interface ITagsRepo {
  insert(tag: Tag): Promise<Tag>;
}

export type DbTag = Omit<
  Overwrite<
    Tag,
    {
      _id: string;
    }
  >,
  "id"
>;

export class TagsRepo implements ITagsRepo {
  private tags: Collection<DbTag>;
  private getUID: (args?: { prefix: string }) => string;

  constructor(private db: Db) {
    this.tags = this.db.collection<DbTag>("tags");
    this.getUID = uid;
  }

  private getTagUID(): string {
    return this.getUID({ prefix: "tag" });
  }

  private fromDbToDomain(tag: DbTag): Tag {
    return {
      id: tag._id,
      name: tag.name,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  private fromDomainToDb(tag: Tag): DbTag {
    return {
      _id: tag.id,
      name: tag.name,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  async insert(tag: Tag): Promise<Tag> {
    const _id = this.getTagUID();

    await this.tags.insertOne(this.fromDomainToDb({ ...tag, id: _id }));

    return this.fromDbToDomain({
      _id,
      ...tag,
    });
  }
}
