import {
  StackContext,
  Api,
  ViteStaticSite,
  Function
} from "@serverless-stack/resources";
import { aws_kms } from "aws-cdk-lib";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import fs from "fs-extra";
import path from "path";
import { LayerVersion, Code } from "aws-cdk-lib/aws-lambda";

export function Stack({ app, stack }: StackContext) {
  const prismaLayerPath = ".sst/layers/prisma";

  fs.removeSync(prismaLayerPath);
  fs.mkdirSync(prismaLayerPath, { recursive: true });

  if (!app.local) {
    // Create a layer for production
    // This saves shipping Prisma binaries once per function
    const layerPath = ".sst/layers/prisma";

    // Clear out the layer path
    fs.removeSync(layerPath);
    fs.mkdirSync(layerPath, { recursive: true });

    // Copy files to the layer
    const toCopy = [
      "node_modules/.prisma",
      "node_modules/@prisma/client",
      "node_modules/prisma/build"
    ];

    for (const file of toCopy) {
      fs.copySync(file, path.join(layerPath, "nodejs", file), {
        // Do not include binary files that aren't for AWS to save space
        filter: (src) => !src.endsWith("so.node") || src.includes("rhel")
      });
    }
    const prismaLayer = new LayerVersion(stack, "PrismaLayer", {
      code: Code.fromAsset(path.resolve(layerPath))
    });

    // Add to all functions in this stack
    stack.addDefaultFunctionLayers([prismaLayer]);
  }

  const dburlParam = StringParameter.fromSecureStringParameterAttributes(
    stack,
    "DatabaseConnectionStringParam",
    {
      parameterName: "/phractal/dev/supabase/connectionstring"
    }
  );

  const supabaseJWTSecretParam =
    StringParameter.fromSecureStringParameterAttributes(
      stack,
      "SupabaseJWTSecret",
      {
        parameterName: "/phractal/dev/supabase/jwtsecret"
      }
    );

  const ssmKey = aws_kms.Key.fromLookup(stack, "SSMKey", {
    aliasName: "alias/aws/ssm"
  });

  const createProfile = new Function(stack, "CreateProfile", {
    handler: "functions/lambda.main",
    environment: {
      DB_PARAM_NAME: dburlParam.parameterName
    },
    bundle: {
      externalModules: app.local ? [] : ["@prisma/client", ".prisma"]
    }
  });

  dburlParam.grantRead(createProfile);
  ssmKey.grantDecrypt(createProfile);

  const supabaseAuthorizer = new Function(stack, "SupabaseAuthorizer", {
    handler: "functions/auth/authorizer.main",
    environment: {
      JWT_SECRET_PARAM_NAME: supabaseJWTSecretParam.parameterName
    }
  });

  supabaseJWTSecretParam.grantRead(supabaseAuthorizer);
  ssmKey.grantDecrypt(supabaseAuthorizer);

  const api = new Api(stack, "api", {
    authorizers: {
      supabase: {
        type: "lambda",
        responseTypes: ["simple"],
        function: supabaseAuthorizer
      }
    },
    defaults: {
      authorizer: "supabase"
    },
    routes: {
      "POST /profiles": {
        function: createProfile
      }
    }
  });

  if (app.stage === "dev" || app.stage === "prod") {
    new ViteStaticSite(stack, "app", {
      path: "app",
      environment: {
        STAGE: app.stage
      },
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
