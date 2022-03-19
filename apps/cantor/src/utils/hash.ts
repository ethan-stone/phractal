import { createHash } from "crypto";

export function hash(input: string, salt: string) {
  return createHash("sha512")
    .update(input + salt)
    .digest("hex");
}
