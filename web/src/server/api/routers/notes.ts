import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { updateNoteUseCase } from "@/server/api/useCases/update-note-use-case";
import {
  getNoteByIdAndUserId,
  insertNote,
  updateNoteById,
} from "@/server/db/note";
import { newNoteUseCase } from "@/server/api/useCases/new-note-use-case";

export const notesRouter = createTRPCRouter({
  newNote: protectedProcedure.mutation(async ({ ctx }) => {
    return newNoteUseCase(
      { userId: ctx.session.user.id },
      {
        insertNote,
      }
    );
  }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return updateNoteUseCase(
        {
          noteId: input.id,
          userId: ctx.session.user.id,
        },
        {
          content: input.content,
          name: input.name,
        },
        {
          getNoteByIdAndUserId,
          updateNoteById,
        }
      );
    }),
});
