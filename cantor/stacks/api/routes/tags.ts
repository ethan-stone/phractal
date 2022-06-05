import * as sst from "@serverless-stack/resources";

type Args = {
  environment: {
    [k: string]: string;
  };
  permissions: sst.Permissions;
};

export function constructTagsRoutes(args: Args): {
  [key: string]:
    | sst.FunctionDefinition
    | sst.ApiFunctionRouteProps
    | sst.ApiHttpRouteProps
    | sst.ApiAlbRouteProps;
} {
  return {
    "POST /tags": {
      function: {
        handler: "src/tags/create.main",
        environment: args.environment,
        permissions: args.permissions
      }
    }
  };
}
