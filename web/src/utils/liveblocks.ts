import { env } from "@/env.mjs";
import { createClient } from "@liveblocks/client";

export const client = createClient({
  publicApiKey: env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
});
