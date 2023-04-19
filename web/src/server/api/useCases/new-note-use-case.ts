import { type INotesRepo } from "@/server/repos/notes-repo";

export async function newNoteUseCase(
  args: {
    userId: string;
  },
  ctx: {
    notesRepo: INotesRepo;
  }
) {
  return ctx.notesRepo.insert({
    userId: args.userId,
    name: "Untitled",
    content: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
