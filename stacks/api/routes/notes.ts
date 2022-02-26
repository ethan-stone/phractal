import * as sst from "@serverless-stack/resources";

type Args = {
  environment: {
    [k: string]: string;
  };
  permissions: sst.Permissions;
};

export function constructNotesRoutes(args: Args): {
  [key: string]:
    | sst.FunctionDefinition
    | sst.ApiFunctionRouteProps
    | sst.ApiHttpRouteProps
    | sst.ApiAlbRouteProps;
} {
  return {
    "POST /notes": {
      function: {
        handler: "src/notes/create.main",
        environment: args.environment,
        permissions: args.permissions
      }
    },
    "GET /notes/{id}": {
      function: {
        handler: "src/notes/retrieveById.main",
        environment: args.environment,
        permissions: args.permissions
      }
    },
    "GET /notes": {
      function: {
        handler: "src/notes/retrieve.main",
        environment: args.environment,
        permissions: args.permissions
      }
    },
    "PATCH /notes/{id}": {
      function: {
        handler: "src/notes/update.main",
        environment: args.environment,
        permissions: args.permissions
      }
    }
  };
}
