import { env } from "@/env.mjs";
import { type NextApiRequest, type NextApiResponse } from "next";
import { Webhook } from "svix";
import { z } from "zod";
import { buffer } from "micro";
import { type WebhookEvent } from "@clerk/clerk-sdk-node";

const secret = env.CLERK_WH_SECRET;

const wh = new Webhook(secret);

export const headerSchema = z.object({
  "svix-id": z.string(),
  "svix-timestamp": z.string(),
  "svix-signature": z.string(),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = await headerSchema.spa({
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"],
  });

  if (!headers.success) {
    return res.status(400).json({});
  }

  const payload = (await buffer(req)).toString();

  const event = wh.verify(payload, headers.data) as WebhookEvent;

  console.log(event);

  switch (event.type) {
    case "user.created": {
      console.log("user created");
      break;
    }
  }

  console.log(payload);

  return res.status(200).json({});
};

export default handler;
