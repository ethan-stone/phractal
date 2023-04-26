import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { updateNoteUseCase } from "@/server/api/useCases/update-note-use-case";
import { notesRepo } from "@/server/repos/notes-repo";
import { newNoteUseCase } from "@/server/api/useCases/new-note-use-case";
import { listNotesUseCase } from "@/server/api/useCases/list-notes-use-case";
import { getNoteById } from "@/server/api/useCases/get-note-by-id-use-case";
import { permissionsRepo } from "@/server/repos/permissions-repo";

export const notesRouter = createTRPCRouter({
  newNote: protectedProcedure.mutation(async ({ ctx }) => {
    return newNoteUseCase(
      { userId: ctx.auth.userId },
      {
        notesRepo,
        permissionsRepo,
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
          userId: ctx.auth.userId,
        },
        {
          content: input.content,
          name: input.name,
        },
        {
          notesRepo,
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
      return listNotesUseCase(
        {
          userId: ctx.auth.userId,
          limit: input.limit,
          startingAfter: input.cursor,
        },
        {
          notesRepo,
        }
      );
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await getNoteById(
        { userId: ctx.auth.userId, noteId: input.id },
        { notesRepo }
      );
    }),
});
