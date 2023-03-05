import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { updateNoteUseCase } from "@/server/api/useCases/update-note-use-case";
import {
  getNoteByIdAndUserId,
  insertNote,
  paginateNotesByUserId,
  updateNoteById,
} from "@/server/db/note";
import { newNoteUseCase } from "@/server/api/useCases/new-note-use-case";
import { listNotesUseCase } from "@/server/api/useCases/list-notes-use-case";

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
  listNotes: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(25),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log(input);
      return listNotesUseCase(
        {
          userId: ctx.session.user.id,
          limit: input.limit,
          startingAfter: input.cursor,
        },
        {
          paginateNotesByUserId,
        }
      );
    }),
});
