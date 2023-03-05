import { type PaginateNotesByUserIdAndUpdatedAtFn } from "@/server/db/note";

export async function listNotesUseCase(
  args: { userId: string; limit: number; startingAfter?: string },
  ctx: {
    paginateNotesByUserId: PaginateNotesByUserIdAndUpdatedAtFn;
  }
) {
  const page = await ctx.paginateNotesByUserId({
    userId: args.userId,
    limit: args.limit,
    startingAfter: args.startingAfter,
  });

  return page;
}