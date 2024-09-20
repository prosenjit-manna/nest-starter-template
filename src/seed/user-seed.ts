import { PrismaClient, RoleName, UserType } from '@prisma/client';
import appEnv from 'src/env';
const prismaClient = new PrismaClient();
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import _ from 'lodash';

export async function userSeed() {
  // Delete all users
  await prismaClient.user.deleteMany();
  await prismaClient.userRole.deleteMany();


  // get admin roles 
  const superAdminRole = await prismaClient.role.findFirst({
    where: { name: RoleName.SUPER_ADMIN },
  });


  // Create Super Admin users
  const adminEmail = `${appEnv.SEED_EMAIL.split('@')[0]}+super-admin@${appEnv.SEED_EMAIL.split('@')[1]}`;
  
  const hashedPassword = bcrypt.hashSync(appEnv.SEED_PASSWORD, 10);

  await prismaClient.user.create({
    data: {
      name: faker.person.fullName(),
      email: adminEmail,
      password: hashedPassword,
      userType: UserType.SUPER_ADMIN,
    },
  });

   // Get User
   const user = await prismaClient.user.findFirst({
    where: { email: adminEmail },
  });

  // Attach Role 
  if (user && superAdminRole) {
    await prismaClient.userRole.create({
      data: {
        userId: user?.id,
        roleId: superAdminRole?.id,
      },
    });
  }

  // Create Admin users
  _.range(0, 2).forEach(async (i) => {
    const email = `${appEnv.SEED_EMAIL.split('@')[0]}+admin-${i}@${appEnv.SEED_EMAIL.split('@')[1]}`;
    await prismaClient.user.create({
      data: {
        name: faker.person.fullName(),
        email,
        password: hashedPassword,
        userType: UserType.ADMIN,
      },
    });
  });


  // get admin roles
  const adminRole = await prismaClient.role.findFirst({
    where: { name: RoleName.ADMIN },
  });

  // Get Admin User
  const adminUsers = await prismaClient.user.findMany({
    where: { userType: UserType.ADMIN },
  });

  // Attach Role 
  if (adminUsers && adminRole) {
    adminUsers.forEach(async (user) => {
      await prismaClient.userRole.create({
        data: {
          userId: user?.id,
          roleId: adminRole?.id,
        },
      });
    });
  }
  
}
