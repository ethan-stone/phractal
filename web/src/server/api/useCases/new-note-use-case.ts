import { type InsertNoteFn } from "@/server/db/note";
import { type Note } from "@/server/domain/note";

export async function newNoteUseCase(
  note: Note,
  ctx: {
    insertNote: InsertNoteFn;
  }
) {
  return ctx.insertNote(note);
}
