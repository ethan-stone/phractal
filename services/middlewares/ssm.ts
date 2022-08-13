import {
  SSMClient,
  GetParameterCommand,
  SSMClientConfig
} from "@aws-sdk/client-ssm";
import middy from "@middy/core";

type Options = {
  ssmClientConfig: SSMClientConfig;
  ssmParams: Record<string, string | undefined>;
};

export type SSMParamsContext<T extends Record<string, string | undefined>> =
  AWSLambda.Context & {
    ssmParams: T;
  };

export const ssmMiddleware = (opts: Options): middy.MiddlewareObj => {
  const ssmParams: Record<string, string | undefined> = {};
  const ssmClient = new SSMClient(opts.ssmClientConfig);

  const before: middy.MiddlewareFn = async (request): Promise<void> => {
    for (const [k, v] of Object.entries(opts.ssmParams)) {
      if (!ssmParams[k]) {
        const result = await ssmClient.send(
          new GetParameterCommand({
            WithDecryption: true,
            Name: v
          })
        );

        ssmParams[k] = result.Parameter?.Value;
      }
    }

    Object.assign(request.context, { ssmParams });
  };

  return { before };
};
