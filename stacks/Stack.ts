import * as sst from "@serverless-stack/resources";
import { ApiPayloadFormatVersion } from "@serverless-stack/resources";

export default class Stack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    new sst.Auth(this, "users", {
      cognito: {
        userPool: {
          signInAliases: {
            email: true
          }
        }
      }
    });

    // Create a HTTP API
    const restApi = new sst.Api(this, "rest-api", {
      defaultPayloadFormatVersion: ApiPayloadFormatVersion.V2,
      routes: {
        "GET /hello-world": "src/lambda.main"
      }
    });

    // Show the endpoint in the output
    this.addOutputs({
      RESTApiEdnpoint: restApi.url
    });
  }
}
