import { type INotesRepo } from "@/server/repos/notes-repo";

export class NoteNotFoundError extends Error {}

export async function updateNoteUseCase(
  args: { userId: string; noteId: string },
  updates: {
    name?: string;
    content?: string;
  },
  ctx: {
    notesRepo: INotesRepo;
  }
) {
  // 1. check that user has permission to note by first retrieving the note
  const note = await ctx.notesRepo.getByIdAndUserId(args.noteId, args.userId);

  // user does not own this note
  if (!note) throw new NoteNotFoundError();

  // 2. update the note
  const newNote = await ctx.notesRepo.updateById(args.noteId, {
    name: updates.name,
    content: updates.content,
  });

  if (!newNote) throw new NoteNotFoundError();

  return newNote;
}
