import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import appEnv from './env';

const prismaClient = new PrismaClient();

async function main() {
  // Delete all users 
  await prismaClient.user.deleteMany();
  const hashedPassword = await bcrypt.hash(appEnv.SEED_PASSWORD, 10);

  _.range(0, 10).forEach(async () => {

    await prismaClient.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword
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
