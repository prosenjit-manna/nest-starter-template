import {
  Prisma,
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

  // create privileges data
  const privilegeData: Prisma.PrivilegeCreateManyInput | Prisma.PrivilegeCreateManyInput[] = [];
  const models = [PrivilegeGroup.POST, PrivilegeGroup.USER];
  models.forEach((model) => {
    [PrivilegeName.CREATE, PrivilegeName.DELETE, PrivilegeName.UPDATE, PrivilegeName.READ].forEach((name) => {
      privilegeData.push({
        name,
        group: model,
        type: PrivilegeType.BASE,
      });
    });
  });

  // Create privileges
  await prismaClient.privilege.createMany({
    data: privilegeData,
  });

  // Create roles
  const rolesData: Prisma.RoleCreateManyInput | Prisma.RoleCreateManyInput[] = [];
  [RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.USER].forEach((name) => {
    rolesData.push({
      name,
      title: name.toLowerCase().replace('_', ' '),
    });
  });
  
  await prismaClient.role.createMany({
    data: rolesData
  });

  //  find base privileges
  const basePrivileges = await prismaClient.privilege.findMany({
    where: {
      type: PrivilegeType.BASE,
    },
  });


  // find super admin role
  const superAdminRole = await prismaClient.role.findFirst({
    where: {
      name: RoleName.SUPER_ADMIN,
    },
  });
  
  if (superAdminRole) {
    // Attach all privileges to super admin role
    await prismaClient.rolePrivilege.createMany({
      data: basePrivileges.map((privilege) => ({
        roleId: superAdminRole.id,
        privilegeId: privilege.id,
      })),
    });
  }


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
