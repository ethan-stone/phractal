import { type InsertNoteFn } from "@/server/db/note";

export async function newNoteUseCase(
  args: {
    userId: string;
  },
  ctx: {
    insertNote: InsertNoteFn;
  }
) {
  return ctx.insertNote({
    userId: args.userId,
    name: "Untitled",
    content: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
