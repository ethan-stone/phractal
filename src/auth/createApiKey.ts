import { PrismaClient } from "@prisma/client";
import { customAlphabet } from "nanoid";
import { hash } from "../utils/hash";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
);

const prisma = new PrismaClient();

async function main() {
  const apiId = nanoid(21);
  const salt = nanoid(10);
  const apiKey = nanoid(36);

  const hashedKey = hash(apiKey, salt);

  await prisma.apiKey.create({
    data: {
      id: apiId,
      salt: salt,
      key: hashedKey
    }
  });

  console.log(`${apiId}.${apiKey}`);
}

main();
