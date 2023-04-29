import { type Collection, type Db } from "mongodb";
import { type User } from "../domain/user";
import { type Overwrite } from "../utils/types";
import { db } from "../db/client";

export interface IUserRepo {
  insert(user: User): Promise<User>;
  deleteById(id: string): Promise<void>;
}

export type DbUser = Omit<
  Overwrite<
    User,
    {
      _id: string;
    }
  >,
  "id"
>;

export class UserRepo implements IUserRepo {
  private users: Collection<DbUser>;

  constructor(private db: Db) {
    this.users = this.db.collection<DbUser>("users");
  }

  private fromDbToDomain(user: DbUser): User {
    return {
      id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private fromDomainToDb(user: User): DbUser {
    return {
      _id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async insert(user: User): Promise<User> {
    const dbUser = this.fromDomainToDb(user);
    await this.users.insertOne(dbUser);
    return this.fromDbToDomain(dbUser);
  }

  async deleteById(id: string): Promise<void> {
    await this.users.deleteOne({ _id: id });
  }
}

export const userRepo = new UserRepo(db);
