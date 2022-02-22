import * as sst from "@serverless-stack/resources";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";

export default class Stack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const users = new sst.Auth(this, "users", {
      cognito: {
        userPool: {
          signInAliases: { email: true }
        },
        triggers: {
          postConfirmation: "src/auth/postConfirmationTrigger.main"
        }
      }
    });

    const notesBucket = new sst.Bucket(this, "notes-bucket");

    // Create a HTTP API
    const restApi = new sst.Api(this, "rest-api", {
      defaultPayloadFormatVersion: sst.ApiPayloadFormatVersion.V2,
      defaultAuthorizer: new HttpUserPoolAuthorizer(
        "users-authorizer",
        users.cognitoUserPool as cognito.UserPool,
        {
          userPoolClients: [
            users.cognitoUserPoolClient as cognito.UserPoolClient
          ]
        }
      ),
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      routes: {
        "GET /hello-world": "src/lambda.main",
        "POST /notes": {
          function: {
            handler: "src/notes/create.main",
            environment: { notesBucketName: notesBucket.bucketName },
            permissions: [notesBucket]
          }
        }
      }
    });

    // Show the endpoint in the output
    this.addOutputs({
      RESTApiEndpoint: restApi.url,
      UserPoolId: users.cognitoUserPool?.userPoolId as string,
      UserPoolClientId: users.cognitoUserPoolClient?.userPoolClientId as string,
      IdentityPoolId: users.cognitoIdentityPoolId
    });
  }
}
