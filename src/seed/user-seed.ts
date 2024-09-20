import { PrismaClient, RoleName, UserType } from '@prisma/client';
import appEnv from 'src/env';
const prismaClient = new PrismaClient();
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export async function userSeed() {
  // Delete all users
  await prismaClient.user.deleteMany();
  await prismaClient.userRole.deleteMany();


  // get admin roles 
  const adminRole = await prismaClient.role.findFirst({
    where: { name: RoleName.ADMIN },
  });


  // Create Admin users
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
  if (user && adminRole) {
    await prismaClient.userRole.create({
      data: {
        userId: user?.id,
        roleId: adminRole?.id,
      },
    });
  }
  
}
