import middy from "@middy/core";
import { PrismaClient } from "@prisma/client";
import {
  SSMClient,
  GetParameterCommand,
  SSMClientConfig
} from "@aws-sdk/client-ssm";

type Options = {
  ssmCLientConfig: SSMClientConfig;
  paramName: string;
};

export type PrismaContext = AWSLambda.Context & { prisma: PrismaClient };

export const prismaMiddleware = (opts: Options): middy.MiddlewareObj => {
  const ssmClient = new SSMClient(opts.ssmCLientConfig);
  let prisma: PrismaClient;

  const before: middy.MiddlewareFn = async (request): Promise<void> => {
    if (!prisma) {
      const result = await ssmClient.send(
        new GetParameterCommand({
          WithDecryption: true,
          Name: opts.paramName
        })
      );

      prisma = new PrismaClient({
        datasources: {
          db: {
            url: result.Parameter?.Value
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
