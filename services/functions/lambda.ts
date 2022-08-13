import middy from "@middy/core";
import { ssmMiddleware, SSMParamsContext } from "@middlewares/ssm";
import { prismaMiddleware, PrismaContext } from "@middlewares/prisma";
import { z } from "zod";
import {
  bodyParserMiddleware,
  ParsedBodyContext
} from "@middlewares/body-parser";
import { createResponse } from "@http-responses";

const requestBodySchema = z.object({
  uid: z.string(),
  email: z.string().email()
});

type RequestBody = z.infer<typeof requestBodySchema>;

type Event = Phractal.APIGatewayProxyEventV2WithLambdaAuthorizer;
type Context = SSMParamsContext<{ prisma: string }> &
  PrismaContext &
  ParsedBodyContext<RequestBody>;
type Result = AWSLambda.APIGatewayProxyResultV2;

export const handler = async (_: Event, ctx: Context): Promise<Result> => {
  const user = await ctx.prisma.profile.create({
    data: ctx.body
  });

  return createResponse({
    statusCode: 200,
    body: user
  });
};

export const main = middy(handler);

main
  .use(
    bodyParserMiddleware({
      schema: requestBodySchema
    })
  )
  .use(
    ssmMiddleware({
      ssmClientConfig: {},
      ssmParams: {
        prisma: process.env.DB_PARAM_NAME || ""
      }
    })
  )
  .use(prismaMiddleware());
