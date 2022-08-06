import { StackContext, Api, ViteStaticSite } from "@serverless-stack/resources";
import { HostedZone } from "aws-cdk-lib/aws-route53";

export function Stack({ app, stack }: StackContext) {
  const api = new Api(stack, "api", {
    routes: {
      "GET /": "functions/lambda.handler"
    }
  });

  if (app.stage === "dev" || app.stage === "prod") {
    new ViteStaticSite(stack, "app", {
      path: "app",
      customDomain: {
        domainName:
          app.stage === "prod" ? "phractal.xyz" : `${app.stage}.phractal.xyz`,
        domainAlias:
          app.stage === "prod"
            ? "www.phractal.xyz"
            : `www.${app.stage}.phractal.xyz`,
        cdk: {
          hostedZone: HostedZone.fromHostedZoneAttributes(stack, "HostedZone", {
            hostedZoneId: "Z0525134PDNOUUHPV71Y",
            zoneName: "phractal.xyz"
          })
        }
      }
    });
  }

  stack.addOutputs({
    ApiEndpoint: api.url
  });
}
