// src/server/router/context.ts
import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import type { DefaultSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import { db } from "../db/client";
import superjson from "superjson";

interface Session extends DefaultSession {
  user: DefaultSession["user"] & { sub: string };
}

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions
) => {
  const req = opts?.req;
  const res = opts?.res;

  const session =
    req &&
    res &&
    ((await getServerSession(req, res, nextAuthOptions)) as Session);

  return {
    req,
    res,
    session,
    db
  };
};

type Context = inferAsyncReturnType<typeof createContext>;

export const t = initTRPC.context<Context>().create({
  transformer: superjson
});
