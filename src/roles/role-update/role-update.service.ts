import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RoleUpdateResponse } from './role-update-response.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleUpdateInput } from './role-update-input.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class RoleUpdateService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => RoleUpdateResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.ROLE)
  @SetMetadata('privilegeName', PrivilegeName.UPDATE)
  async updateRole(
    @Args('roleUpdateInput') roleUpdateInput: RoleUpdateInput,
  ): Promise<RoleUpdateResponse> {
    const role = await this.prisma.role.update({
      where: {
        id: roleUpdateInput.id,
      },
      data: {
        title: roleUpdateInput.title,
      },
    });

    // assign base privileges to the role

    await this.prisma.rolePrivilege.createMany({
      data: roleUpdateInput.createPrivileges.map((privilege) => ({
        roleId: role.id,
        privilegeId: privilege,
      })),
    });

    // remove privileges from the role
    await this.prisma.rolePrivilege.deleteMany({
      where: {
        roleId: role.id,
        privilegeId: {
          in: roleUpdateInput.removePrivileges,
        },
      },
    });

    return role;
  }
}
