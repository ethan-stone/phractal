import { db } from "./client";
import { type Tag } from "@/server/domain/tag";

type DbTag = Omit<Tag, "id"> & { _id: string };

const tagColl = db.collection<DbTag>("tags");

function convertDbTagToTag(dbTag: DbTag): Tag {
  return {
    id: dbTag._id,
    name: dbTag.name,
  };
}
