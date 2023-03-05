import { type Note } from "@/server/domain/note";
import { db } from "./client";

type DbNote = Omit<Note, "id"> & { _id: string };

const noteColl = db.collection<DbNote>("notes");

export type InsertNoteFn = (note: Note) => Promise<Note>;

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

export const insertNote: InsertNoteFn = async (note) => {
  await noteColl.insertOne({
    _id: `note_${note.id}`,
    content: note.content,
    name: note.name,
    userId: note.userId,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });

  return note;
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
