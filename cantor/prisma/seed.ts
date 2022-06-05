import { PrismaClient } from "@prisma/client";
import { Chance } from "chance";

const prisma = new PrismaClient();
const chance = new Chance();

async function main() {
  const email = chance.email();
  const id = chance.string({ length: 20 });

  const user = await prisma.user.create({
    data: {
      id,
      email
    }
  });

  for (let i = 0; i < 3; i++) {
    const name = chance.string();

    if (i === 0) {
      // first round just create a note
      await prisma.node.create({
        data: {
          kind: "NOTE",
          name,
          ownerId: user.id,
          position: i,
          visibility: "PUBLIC"
        }
      });
      continue;
    }

    const folder = await prisma.node.create({
      data: {
        kind: "FOLDER",
        name,
        ownerId: user.id,
        position: i,
        visibility: "PUBLIC"
      }
    });

    for (let j = 0; j < 3; j++) {
      const nestedName = chance.string();

      if (j === 0) {
        // first round just create a note
        await prisma.node.create({
          data: {
            kind: "NOTE",
            name: nestedName,
            ownerId: user.id,
            position: j,
            visibility: "PUBLIC",
            parentId: folder.id
          }
        });
        continue;
      }

      const nestedFolder = await prisma.node.create({
        data: {
          kind: "FOLDER",
          name: nestedName,
          ownerId: user.id,
          position: j,
          visibility: "PUBLIC",
          parentId: folder.id
        }
      });

      for (let k = 0; k < 3; k++) {
        const nestedNestedName = chance.string();

        await prisma.node.create({
          data: {
            kind: "NOTE",
            name: nestedNestedName,
            ownerId: user.id,
            position: k,
            visibility: "PUBLIC",
            parentId: nestedFolder.id
          }
        });
      }
    }
  }
}

main();
