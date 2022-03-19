import { PrismaClient, Prisma } from "@prisma/client";
import { Chance } from "chance";

const prisma = new PrismaClient();
const chance = new Chance();

async function main() {
  const users: Prisma.UserCreateManyInput[] = [];
  for (let i = 0; i < 1000; i++) {
    const email = chance.email();
    const username = chance.string();

    users.push({ email, username });
  }

  await prisma.user.createMany({ data: users });
}

main();
