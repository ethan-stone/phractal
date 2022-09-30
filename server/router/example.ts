import { t } from "./context";
import { z } from "zod";

export const exampleRouter = t.router({
  hello: t.procedure
    .input(
      z
        .object({
          text: z.string().optional()
        })
        .optional()
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`
      };
    })
});
