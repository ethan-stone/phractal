import { env } from "@/env.mjs";
import { Configuration, OpenAIApi } from "openai";

export const openai = new OpenAIApi(
  new Configuration({
    apiKey: env.OPENAI_API_KEY,
  })
);
