import { type UpdateNoteByIdFn } from "@/server/db/note";

export async function updateNoteUseCase(
  noteId: string,
  updates: {
    name: string;
    content: string;
  },
  ctx: {
    updateNoteById: UpdateNoteByIdFn;
  }
) {
  await ctx.updateNoteById(noteId, {
    name: updates.name,
    content: updates.content,
  });
}
