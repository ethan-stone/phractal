import { PostConfirmationTriggerEvent } from "aws-lambda";
import { Prisma, PrismaClient } from "@prisma/client";
import pino from "pino";

/**
 * There are more user attributes than this. These are just the
 * ones we care about
 */
type UserAttributes = {
  sub: string;
  email: string;
};

const prisma = new PrismaClient();

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug"
});

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

      logger.info(
        {
          service: "auth",
          function: "postConfirmationTrigger",
          environment: process.env.IS_LOCAL ? "local" : process.env.NODE_ENV
        },
        `User created with id ${userAttributes.sub}`
      );
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        logger.error(
          {
            service: "auth",
            function: "postConfirmationTrigger",
            environment: process.env.IS_LOCAL ? "local" : process.env.NODE_ENV
          },
          e.message
        );
      } else if (e instanceof Error) {
        logger.error(
          {
            service: "auth",
            function: "postConfirmationTrigger",
            environment: process.env.IS_LOCAL ? "local" : process.env.NODE_ENV
          },
          e.message
        );
      }
    }
  }

  return event;
}
