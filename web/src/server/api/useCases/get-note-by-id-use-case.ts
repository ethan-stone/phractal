import { type INotesRepo } from "@/server/repos/notes-repo";

type Args = {
  userId: string;
  noteId: string;
};

type Ctx = {
  notesRepo: INotesRepo;
};

export class NoteNotFoundError extends Error {}

export async function getNoteById(args: Args, ctx: Ctx) {
  const note = await ctx.notesRepo.getByIdAndUserId(args.noteId, args.userId);

  if (!note) {
    throw new NoteNotFoundError(`Note with id ${args.noteId} not found`);
  }

  return note;
}
