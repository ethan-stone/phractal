import { StackContext, Function } from "sst/constructs";

export function WebStack({ stack }: StackContext) {
  new Function(stack, "Handler", {
    handler: "services/functions/handler.main",
  });
}
