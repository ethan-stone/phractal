import { PostConfirmationTriggerEvent } from "aws-lambda";
import { PrismaClient } from "@prisma/client";
import pino from "pino";
import { Logger } from "../utils/logger";

/**
 * There are more user attributes than this. These are just the
 * ones we care about
 */
type UserAttributes = {
  sub: string;
  email: string;
};

const prisma = new PrismaClient();

const logger = new Logger(
  pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug"
  }),
  {
    service: "auth",
    functionName: "postConfirmationTrigger"
  }
);

export async function main(
  event: PostConfirmationTriggerEvent
): Promise<PostConfirmationTriggerEvent> {
  if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
    const userAttributes = event.request.userAttributes as UserAttributes;

    try {
      await prisma.user.create({
        data: {
          id: userAttributes.sub,
          email: userAttributes.email
        }
      });

      logger.info(`User created with id ${userAttributes.sub}`);
    } catch (e: unknown) {
      logger.error(e);
    }
  }

  return event;
}
