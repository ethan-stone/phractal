import { type User } from "@/server/domain/user";
import { db } from "./client";

type DbUser = Omit<User, "id"> & { _id: string };

const userColl = db.collection<DbUser>("users");

function convertDbUserToUser(dbUser: DbUser): User {
  return {
    id: dbUser._id,
    email: dbUser.email,
    emailVerified: dbUser.emailVerified,
    image: dbUser.image,
    name: dbUser.name,
  };
}

export type InsertUserFn = (user: User) => Promise<User>;

export const insertUser: InsertUserFn = async (user) => {
  await userColl.insertOne({
    _id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    name: user.name,
  });

  return user;
};

export type GetUserByIdFn = (id: string) => Promise<User | null>;

export const getUserById: GetUserByIdFn = async (id) => {
  const user = await userColl.findOne({
    _id: id,
  });

  return user && convertDbUserToUser(user);
};

export type GetUserByEmailFn = (email: string) => Promise<User | null>;

export const getUserByEmail: GetUserByEmailFn = async (email) => {
  const user = await userColl.findOne({
    email,
  });

  return user && convertDbUserToUser(user);
};

export type UpdateUserByIdFn = (
  id: string,
  updates: Partial<User>
) => Promise<User | null>;

export const updateUserById: UpdateUserByIdFn = async (id, updates) => {
  const res = await userColl.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        email: updates.email,
        emailVerified: updates.emailVerified,
        name: updates.name,
        image: updates.image,
      },
    }
  );

  return res.value && convertDbUserToUser(res.value);
};

export type DeleteUserByIdFn = (id: string) => Promise<void>;

export const deleteUserById: DeleteUserByIdFn = async (id) => {
  await userColl.deleteOne({ _id: id });
};
