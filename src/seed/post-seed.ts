import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient();
import { faker } from '@faker-js/faker';

export async function postSeed() {
  // Delete all posts
  await prismaClient.post.deleteMany();

  
  //  Get one user
  const user = await prismaClient.user.findFirst();
  const workspace = await prismaClient.workspace.findFirst();

  // Create Post
  await prismaClient.post.create({
    data: {
      title: faker.lorem.words(5),
      content: faker.lorem.paragraphs(3),
      authorId: user?.id,
      workspaceId: workspace?.id || '',
    },
  });
}
