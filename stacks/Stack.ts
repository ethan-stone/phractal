import * as sst from "@serverless-stack/resources";

export default class Stack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create a HTTP API
    const apolloApi = new sst.ApolloApi(this, "apollo-api", {
      server: "src/lambda.handler"
    });

    // Show the endpoint in the output
    this.addOutputs({
      ApolloApiEndpoint: apolloApi.url
    });
  }
}
