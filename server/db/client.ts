import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  var db: PrismaClient | undefined;
}

const defaultLogLevels: Prisma.LogLevel[] = ["info", "warn", "error"];

const client =
  globalThis.db ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? defaultLogLevels
        : defaultLogLevels.concat(["query"])
  });
if (process.env.NODE_ENV !== "production") globalThis.db = client;

export const db = client;
