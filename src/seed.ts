import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

async function main() {
  await prismaClient.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  });
}

main();
