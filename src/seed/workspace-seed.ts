import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { sample } from 'lodash';
const prismaClient = new PrismaClient();

export async function workSpaceSeed() {
  // delete workspace
  await prismaClient.workspace.deleteMany();
  await prismaClient.workspaceMembership.deleteMany();

  // Create workspace
  await prismaClient.workspace.createMany({
    data: [
      {
        name: faker.company.name(),
      },
      {
        name: faker.company.name(),
      },
    ],
  });

  // Get all workspaces
  const workspaces = await prismaClient.workspace.findMany();
  // Get Admin Users
  const users = await prismaClient.user.findMany();



  // Attach membership
  const membershipData:
    | Prisma.WorkspaceMembershipCreateManyInput
    | Prisma.WorkspaceMembershipCreateManyInput[] = [];


  users.forEach((user) => {
    membershipData.push({
      workspaceId: sample(workspaces)?.id || '',
      userId: user.id,
      isAccepted: true,
      isOwner: true,
    });
  });


  await prismaClient.workspaceMembership.createMany({
    data: membershipData,
  });
}
