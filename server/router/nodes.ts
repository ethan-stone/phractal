import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const nodesRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
    if (!ctx.session.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    return next();
  })
  .query("create", {
    input: z.object({
      name: z.string()
    }),
    async resolve({ input, ctx }) {
      const newNote = await ctx.prisma.node.create({
        data: {
          name: input.name,
          content: "",
          userId: ctx.session!.user!.sub
        }
      });
      return newNote;
    }
  });
