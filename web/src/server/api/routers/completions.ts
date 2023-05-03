import { openai } from "@/server/ai/client";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const completionsRouter = createTRPCRouter({
  createCompletion: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 100,
        prompt: `Summarize the following text\n${input.content}`,
        user: ctx.auth.userId,
      });

      const text = completion.data.choices[0]?.text;

      if (!text)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No text returned from completion",
        });

      return text;
    }),
});
