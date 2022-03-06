import * as sst from "@serverless-stack/resources";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { constructNotesRoutes } from "./api/routes/notes";

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

    const imagesBucket = new sst.Bucket(this, "images-bucket", {
      s3Bucket: {
        publicReadAccess: true
      }
    });

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

    // Create a HTTP API
    const restApi = new sst.Api(this, "rest-api", {
      defaultPayloadFormatVersion: sst.ApiPayloadFormatVersion.V2,
      defaultAuthorizer: firebaseAuthorizer,
      defaultAuthorizationType: sst.ApiAuthorizationType.CUSTOM,
      routes: {
        "GET /hello-world": "src/lambda.main",
        ...notesRoutes
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
