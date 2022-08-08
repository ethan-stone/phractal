import middy from "@middy/core";
import { z } from "zod";

type Options = {
  schema: z.ZodType;
};

export const bodyValidatorMiddleware = (
  opts: Options
): middy.MiddlewareObj<AWSLambda.APIGatewayProxyEventV2> => {
  const before: middy.MiddlewareFn<AWSLambda.APIGatewayProxyEventV2> = (
    request
  ): void => {
    const body = opts.schema.parse(JSON.parse(request.event.body || "{}"));

    Object.assign(request.event, { body });
  };

  return {
    before
  };
};
