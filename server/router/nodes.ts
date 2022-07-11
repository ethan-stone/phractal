import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const nodesRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    console.log("session", ctx.session);
    if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
    if (!ctx.session.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    return next();
  })
  .query("list", {
    input: z.object({
      cursor: z.string().optional(),
      take: z.number().default(50)
    }),
    async resolve({ input, ctx }) {
      const { cursor, take } = input;
      const items = await ctx.prisma.node.findMany({
        where: {
          userId: ctx.session!.user!.sub
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          nodeTagJunction: {
            select: {
              tag: true
            }
          }
        },
        orderBy: {
          updatedAt: "desc"
        },
        cursor: cursor
          ? {
              id: cursor
            }
          : undefined,
        take: take + 1 // take an extra, the extra will act as the next cursor if applicable
      });

      let nextCursor: typeof cursor | null = null;
      if (items.length > take) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      const nodes = items.map((n) => ({
        ...n,
        nodeTagJunction: undefined,
        tags: n.nodeTagJunction.map((junction) => ({
          id: junction.tag.id,
          name: junction.tag.name
        }))
      }));

      return {
        items: nodes,
        nextCursor
      };
    }
  })
  .mutation("create", {
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
