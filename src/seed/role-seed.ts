import {
  Prisma,
  PrismaClient,
  PrivilegeGroup,
  PrivilegeName,
  PrivilegeType,
  RoleType,
} from '@prisma/client';

const prismaClient = new PrismaClient();

export async function roleSeed() {
  // Delete all privilege and roles
  await prismaClient.privilege.deleteMany();
  await prismaClient.role.deleteMany();

  // create privileges data
  const privilegeData: Prisma.PrivilegeCreateManyInput | Prisma.PrivilegeCreateManyInput[] = [];
  const models = [PrivilegeGroup.POST, PrivilegeGroup.USER, PrivilegeGroup.ROLE, PrivilegeGroup.WORKSPACE, PrivilegeGroup.MEMBERSHIP, PrivilegeGroup.MEDIA];
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
  [RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.USER].forEach((type) => {
    rolesData.push({
      type,
      title: type.toLowerCase().replace('_', ' '),
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
      type: RoleType.SUPER_ADMIN,
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
      type: RoleType.ADMIN,
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


  const userRolePrivileges = await prismaClient.privilege.findMany({
    where: {
      type: PrivilegeType.BASE,
      group: {
        in: [PrivilegeGroup.POST, PrivilegeGroup.USER],
      },
      name: {
        in: [PrivilegeName.READ],
      }
    },
  });

  const memberShipAndWorkspacePrivileges = await prismaClient.privilege.findMany({
    where: {
      type: PrivilegeType.BASE,
      group: {
        in: [PrivilegeGroup.WORKSPACE, PrivilegeGroup.MEMBERSHIP],
      },
    },
  });

 

  // find user role
  const userRole = await prismaClient.role.findFirst({
    where: {
      type: RoleType.USER,
    },
  });
  

  if (userRole) {
    const memberShipAndWorkspacePrivilegesIds = memberShipAndWorkspacePrivileges.map((privilege) => ({
      roleId: userRole.id,
      privilegeId: privilege.id,
    }));

    const otherPrivilegesIds = userRolePrivileges.map((privilege) => ({
      roleId: userRole.id,
      privilegeId: privilege.id,
    }));

    // Attach all privileges to admin role
    await prismaClient.rolePrivilege.createMany({
      data: otherPrivilegesIds.concat(memberShipAndWorkspacePrivilegesIds),
    });
  }

}
