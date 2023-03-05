import { type Note } from "@/server/domain/note";
import { createId } from "@paralleldrive/cuid2";
import { type Filter } from "mongodb";
import { db } from "./client";

type DbNote = Omit<Note, "id"> & { _id: string };

const noteColl = db.collection<DbNote>("notes");

function convertDbNoteToNote(dbNote: DbNote): Note {
  return {
    id: dbNote._id,
    content: dbNote.content,
    name: dbNote.name,
    userId: dbNote.userId,
    createdAt: dbNote.createdAt,
    updatedAt: dbNote.updatedAt,
  };
}

export type InsertNoteFn = (note: Omit<Note, "id">) => Promise<Note>;

export const insertNote: InsertNoteFn = async (note) => {
  const id = `note_${createId()}`;

  await noteColl.insertOne({
    _id: id,
    content: note.content,
    name: note.name,
    userId: note.userId,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });

  return {
    id,
    ...note,
  };
};

export type UpdateNoteByIdFn = (
  id: string,
  updates: Partial<Note>
) => Promise<Note | null>;

export const updateNoteById: UpdateNoteByIdFn = async (id, updates) => {
  const res = await noteColl.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        content: updates.content,
        name: updates.name,
        updatedAt: updates.updatedAt,
        userId: updates.userId,
      },
    }
  );

  return res.value && convertDbNoteToNote(res.value);
};

export type GetNoteByIdAndUserIdFn = (
  id: string,
  userId: string
) => Promise<Note | null>;

export const getNoteByIdAndUserId: GetNoteByIdAndUserIdFn = async (
  id,
  userId
) => {
  const res = await noteColl.findOne({
    _id: id,
    userId,
  });

  return res && convertDbNoteToNote(res);
};

export type PaginateNotesByUserIdAndUpdatedAtFn = (args: {
  userId: string;
  limit: number;
  startingAfter?: string;
}) => Promise<{
  hasMore: boolean;
  items: Note[];
}>;

export const paginateNotesByUserIdAndUpdatedAt: PaginateNotesByUserIdAndUpdatedAtFn =
  async (args) => {
    let filter: Filter<DbNote> = { userId: args.userId };

    if (args.startingAfter) {
      const startingAfterItem = await noteColl.findOne({
        _id: args.startingAfter,
      });

      if (!startingAfterItem)
        throw new Error(
          `No startingAfter item with id: ${args.startingAfter} found`
        );

      filter = {
        ...filter,
        $or: [
          {
            updatedAt: { $lt: startingAfterItem.updatedAt },
          },
          {
            updatedAt: startingAfterItem.updatedAt,
            _id: { $gt: startingAfterItem._id },
          },
        ],
      };
    }

    const cursor = noteColl.find(filter, {
      limit: args.limit + 1,
      sort: {
        updatedAt: "desc",
        _id: "asc",
      },
    });

    const items = await cursor.toArray();

    console.log(items);

    return {
      hasMore: items.length > args.limit,
      items:
        items.length > args.limit
          ? items.slice(0, -1).map((dbNote) => ({
              id: dbNote._id,
              content: dbNote.content,
              name: dbNote.name,
              userId: dbNote.userId,
              createdAt: dbNote.createdAt,
              updatedAt: dbNote.updatedAt,
            }))
          : items.map((dbNote) => ({
              id: dbNote._id,
              content: dbNote.content,
              name: dbNote.name,
              userId: dbNote.userId,
              createdAt: dbNote.createdAt,
              updatedAt: dbNote.updatedAt,
            })),
    };
  };
