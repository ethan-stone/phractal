import { env } from "@/env.mjs";
import { MongoClient } from "mongodb";

const client = new MongoClient(env.MONGO_URI, {
  ignoreUndefined: true,
});

export const db = client.db("phractal");
