import { type INotesRepo } from "@/server/repos/notes-repo";
import { type IPermssionsRepo } from "@/server/repos/permissions-repo";

export async function newNoteUseCase(
  args: {
    userId: string;
  },
  ctx: {
    notesRepo: INotesRepo;
    permissionsRepo: IPermssionsRepo;
  }
) {
  const note = await ctx.notesRepo.insert({
    userId: args.userId,
    name: "Untitled",
    content: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await ctx.permissionsRepo.createResource({
    key: note.id,
    actions: {
      read: {},
      write: {},
      delete: {},
    },
    name: `Note ${note.id}`,
  });

  return note;
}
