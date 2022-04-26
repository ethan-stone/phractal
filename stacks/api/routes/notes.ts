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
        handler: "src/notes/retrieve.main",
        environment: args.environment,
        permissions: args.permissions
      }
    },
    "GET /notes": {
      function: {
        handler: "src/notes/list.main",
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
    },
    "POST /notes/{id}/share": {
      function: {
        handler: "src/notes/share.main",
        environment: args.environment,
        permissions: args.permissions
      }
    },
    "POST /notes/{id}/add-tag": {
      function: {
        handler: "src/notes/addTag.main",
        environment: args.environment,
        permissions: args.permissions
      }
    }
  };
}
