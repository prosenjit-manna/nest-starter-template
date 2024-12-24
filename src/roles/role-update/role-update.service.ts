import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName, RoleType, UserType } from '@prisma/client';

import { RoleUpdateResponse } from './role-update-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleUpdateInput } from './role-update-input.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateAppError } from 'src/shared/create-error/create-error';

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
    @Context('req') req: Request,
  ): Promise<RoleUpdateResponse> {
    const role = await this.prisma.role.findFirst({
      where: {
        id: roleUpdateInput.id,
      },
    });

      if (!role) {
        throw new CreateAppError({
          message: 'Role not found',
          httpStatus: HttpStatus.NOT_FOUND,
        });
      }

    if (req.user?.userType !== UserType.SUPER_ADMIN && role?.type !== RoleType.CUSTOM) {
      throw new CreateAppError({ message: 'You are not allowed to update this role. Only Custom role can be modified.'});
    }

    const updatedRole = await this.prisma.role.update({
      where: {
        id: roleUpdateInput.id,
      },
      data: {
        title: roleUpdateInput.title,
        description: roleUpdateInput.description,
      },
    });

    // assign base privileges to the role

    await this.prisma.rolePrivilege.createMany({
      data: roleUpdateInput.createPrivileges.map((privilege) => ({
        roleId: updatedRole.id,
        privilegeId: privilege,
      })),
    });

    // remove privileges from the role
    await this.prisma.rolePrivilege.deleteMany({
      where: {
        roleId: updatedRole.id,
        privilegeId: {
          in: roleUpdateInput.removePrivileges,
        },
      },
    });

    return updatedRole;
  }
}
