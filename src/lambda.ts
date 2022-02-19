import { ApolloServer } from "apollo-server-lambda";
import {
  queryType,
  objectType,
  makeSchema,
  interfaceType,
  enumType
} from "nexus";

const IS_LOCAL = !!process.env.IS_LOCAL;

const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", { description: "Unique identifier for the resource" });
  }
});

const Account = objectType({
  name: "Account",
  definition(t) {
    t.implements(Node);
    t.string("username");
    t.string("email");
  }
});

const Query = queryType({
  definition(t) {
    t.string("hello", {
      resolve: () => "Hello World 2!"
    });
  }
});

const StatusEnum = enumType({
  name: "StatusEnum",
  members: ["ACTIVE", "DISABLED"]
});

const server = new ApolloServer({
  schema: makeSchema({
    types: [Query]
  }),
  introspection: IS_LOCAL
});

export const handler = server.createHandler();
