import * as sst from "@serverless-stack/resources";
import {
  HttpJwtAuthorizer,
  HttpLambdaAuthorizer,
  HttpLambdaResponseType
} from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { constructNotesRoutes } from "./api/routes/notes";

export default class Stack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);
    const notesBucket = new sst.Bucket(this, "notes-bucket");

    const notesRoutes = constructNotesRoutes({
      environment: {
        NOTES_BUCKET_NAME: notesBucket.bucketName
      },
      permissions: [notesBucket]
    });

    const firebaseAuthorizer = new HttpJwtAuthorizer(
      "firebase-authorizer",
      "https://securetoken.google.com/phractal-dev",
      {
        identitySource: ["$request.header.Authorization"],
        jwtAudience: ["phractal-dev"]
      }
    );

    const apiKeyAuthorizerLambda = new sst.Function(
      this,
      "api-key-authorizer-lambda",
      {
        handler: "src/auth/apiKeyAuthorizer.main"
      }
    );

    const apiKeyAuthorizer = new HttpLambdaAuthorizer(
      "api-key-authorizer",
      apiKeyAuthorizerLambda,
      {
        responseTypes: [HttpLambdaResponseType.SIMPLE],
        identitySource: ["$request.header.x-api-key"]
      }
    );

    // Create a HTTP API
    const restApi = new sst.Api(this, "rest-api", {
      defaultPayloadFormatVersion: sst.ApiPayloadFormatVersion.V2,
      defaultAuthorizer: firebaseAuthorizer,
      defaultAuthorizationType: sst.ApiAuthorizationType.CUSTOM,
      routes: {
        "GET /hello-world": "src/lambda.main",
        "POST /users": {
          function: {
            handler: "src/users/create.main"
          },
          authorizer: apiKeyAuthorizer
        },
        ...notesRoutes
      }
    });

    // Show the endpoint in the output
    this.addOutputs({
      RESTApiEndpoint: restApi.url
    });
  }
}
