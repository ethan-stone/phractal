import { type INotesRepo } from "@/server/repos/notes-repo";

export async function listNotesUseCase(
  args: { userId: string; limit: number; startingAfter?: string },
  ctx: {
    notesRepo: INotesRepo;
  }
) {
  const page = await ctx.notesRepo.paginateByUserIdAndUpdatedAt({
    userId: args.userId,
    limit: args.limit,
    startingAfter: args.startingAfter,
  });

  return page;
}
