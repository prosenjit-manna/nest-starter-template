import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import appEnv from './env';

const prismaClient = new PrismaClient();

async function main() {
  // Delete all privilege and roles 
  await prismaClient.privilege.deleteMany();
  await prismaClient.role.deleteMany();

  // Create privileges
   await prismaClient.privilege.createMany({
    data: [
      { name: 'CREATE_POST' },
      { name: 'UPDATE_POST' },
      { name: 'DELETE_POST' },
      { name: 'READ_POST' },
    ],
  });

  const postPrivilege = await prismaClient.privilege.findMany({
    where: {
      name: {
        in: ['CREATE_POST', 'UPDATE_POST', 'DELETE_POST', 'READ_POST'],
      },
    },
  });

  // Create roles
  await prismaClient.role.createMany({
    data: [
      {
        name: 'ADMIN',
      },
      {
        name: 'USER',
      },
    ],
  });

  const role = await prismaClient.role.findFirst({ where: { name: 'USER' } });

  // Assign roles in privileges
  postPrivilege.forEach(async (privilege) => {
    await prismaClient.privilege.update({
      where: {
        id: privilege.id,
      },
      data: {
        roleId: role?.id
      },
    });
  });


  // Seed Users
  // Delete all users 
  await prismaClient.user.deleteMany();
  const hashedPassword = await bcrypt.hash(appEnv.SEED_PASSWORD, 10);

  _.range(0, 10).forEach(async () => {

    await prismaClient.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword, 
      },
    });  
  })
  
  const users = await prismaClient.user.findMany();

  // Post seed 
  await prismaClient.post.deleteMany();
  _.range(0, 10).forEach(async () => {
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


  // Connect roles with user 
  const userRole = await prismaClient.role.findFirst({ where: { name: 'USER' } });

  const usersData = await prismaClient.user.findMany();
  usersData.forEach(async (user) => {
    await prismaClient.userPrivilege.create({
      data: {
        userId: user.id,
        roleId: userRole?.id,
      },
    });
  });

}

main();
