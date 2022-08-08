import middy from "@middy/core";
import { PrismaClient } from "@prisma/client";

import { SSMParamsContext } from "./ssm";

export type PrismaContext = AWSLambda.Context & { prisma: PrismaClient };

export const prismaMiddleware = (): middy.MiddlewareObj<
  any,
  any,
  any,
  SSMParamsContext<{ prisma: string } & Record<string, string | undefined>>
> => {
  let prisma: PrismaClient;

  const before: middy.MiddlewareFn<
    any,
    any,
    any,
    SSMParamsContext<{ prisma: string } & Record<string, string | undefined>>
  > = async (request): Promise<void> => {
    if (!prisma) {
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: request.context.ssmParams.prisma
          }
        }
      });
    }

    Object.assign(request.context, { prisma });
  };

  return {
    before
  };
};
