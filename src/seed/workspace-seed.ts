import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient, UserType } from '@prisma/client';
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
  const adminUser = await prismaClient.user.findMany({
    where: {
      userType: UserType.ADMIN,
    },
  });

  // Attach membership
  const membershipData:
    | Prisma.WorkspaceMembershipCreateManyInput
    | Prisma.WorkspaceMembershipCreateManyInput[] = [];
  adminUser.forEach((user) => {
    workspaces.forEach((workspace) => {
      membershipData.push({
        workspaceId: workspace.id,
        userId: user.id,
      });
    });
  });
  await prismaClient.workspaceMembership.createMany({
    data: membershipData,
  });
}
