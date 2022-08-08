import middy from "@middy/core";
import { ssmMiddleware, SSMParamsContext } from "middlewares/ssm";
import { prismaMiddleware, PrismaContext } from "../middlewares/prisma";
import { uuid } from "../utils/uuid";
import { z } from "zod";

type Event = Phractal.APIGatewayProxyEventV2WithLambdaAuthorizer;
type Context = SSMParamsContext<{ prisma: string }> & PrismaContext;
type Result = AWSLambda.APIGatewayProxyResultV2;

const requestBodySchema = z.object({
  uid: z.string(),
  email: z.string().email()
});

type RequestBody = z.infer<typeof requestBodySchema>;

export const handler = async (event: Event, ctx: Context): Promise<Result> => {
  const requestBody = requestBodySchema.parse(event.body);

  const user = await ctx.prisma.profile.create({
    data: {
      uid: uuid(),
      email: `${uuid()}@phractal.xyz`
    }
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  };
};

export const main = middy(handler);

main
  .use(
    ssmMiddleware({
      ssmClientConfig: {},
      ssmParams: {
        prisma: process.env.DB_PARAM_NAME || ""
      }
    })
  )
  .use(prismaMiddleware());
