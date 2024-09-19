import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { faker } from '@faker-js/faker';

const prismaClient = new PrismaClient();

async function main() {
  // Delete all users 
  await prismaClient.user.deleteMany();

  _.range(0, 10).forEach(async () => {
    await prismaClient.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
    });  
  })
  
  const users = await prismaClient.user.findMany();

  await prismaClient.post.deleteMany();
  _.range(0, 100).forEach(async () => {
    const randomUser =  _.sample(users);
    await prismaClient.post.create({
      data: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: randomUser?.id,
        published: faker.datatype.boolean(),
      },
    });
  });

}

main();
