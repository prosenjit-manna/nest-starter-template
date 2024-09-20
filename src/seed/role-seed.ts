import {
  PrismaClient,
  PrivilegeGroup,
  PrivilegeName,
  PrivilegeType,
  RoleName,
} from '@prisma/client';

const prismaClient = new PrismaClient();

export async function roleSeed() {
  // Delete all privilege and roles
  await prismaClient.privilege.deleteMany();
  await prismaClient.role.deleteMany();


  // Create privileges
  await prismaClient.privilege.createMany({
    data: [
      {
        name: PrivilegeName.CREATE,
        group: PrivilegeGroup.POST,
        type: PrivilegeType.BASE,
      },
      {
        name: PrivilegeName.DELETE,
        group: PrivilegeGroup.POST,
        type: PrivilegeType.BASE,
      },
      {
        name: PrivilegeName.UPDATE,
        group: PrivilegeGroup.POST,
        type: PrivilegeType.BASE,
      },
      {
        name: PrivilegeName.READ,
        group: PrivilegeGroup.POST,
        type: PrivilegeType.BASE,
      },
    ],
  });
  // Create roles
  await prismaClient.role.createMany({
    data: [
      {
        name: 'ADMIN',
        title: 'Admin',
      },
      {
        name: 'USER',
        title: 'User',
      },
    ],
  });

  //  find base privileges
  const basePrivileges = await prismaClient.privilege.findMany({
    where: {
      type: PrivilegeType.BASE,
    },
  });

  // find admin role
  const adminRole = await prismaClient.role.findFirst({
    where: {
      name: RoleName.ADMIN,
    },
  });
  if (adminRole) {
    // Attach all privileges to admin role
    await prismaClient.rolePrivilege.createMany({
      data: basePrivileges.map((privilege) => ({
        roleId: adminRole.id,
        privilegeId: privilege.id,
      })),
    });
  }

}
