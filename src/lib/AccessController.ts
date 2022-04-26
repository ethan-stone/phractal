import { PrismaClient } from "@prisma/client";

export class AccessController {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
