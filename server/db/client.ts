import { MongoClient } from "mongodb";

if (!process.env.DATABASE_URL) {
  throw new Error('Invalid environment variable: "DATABASE_URL"');
}

const url = process.env.DATABASE_URL;

export const db =
  global.db ||
  new MongoClient(url, {
    ignoreUndefined: true
  });

declare global {
  var db: MongoClient;
}

if (process.env.NODE_ENV !== "production") {
  global.db = db;
}
