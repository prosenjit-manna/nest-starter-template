import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';

import { AssignRoleResponse } from './assign-role-response.dto';
import { AssignRoleInput } from './assign-role-input.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';

@Resolver()
@UseGuards(JwtAuthGuard)
export class AssignRoleService {
  constructor(private readonly prismaService: PrismaService) {}

  @Mutation(() => AssignRoleResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.ROLE)
  @SetMetadata('privilegeName', PrivilegeName.UPDATE)
  async assignRole(
    @Args('assignRoleInput') assignRoleInput: AssignRoleInput,
  ): Promise<AssignRoleResponse> {

    const role = await this.prismaService.role.findUnique({
      where: {
        id: assignRoleInput.roleId,
        deletedAt: null,
      },
    });

    if (!role) {
      throw new CreateAppError({
        message: 'Role not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    // Logic to assign role to user

    // 1: if already role exists for current user then don't create a new row instead show a message that role already exists
    const userRole = await this.prismaService.userRole.findFirst({
      where: {
        userId: assignRoleInput.userId,
        roleId: assignRoleInput.roleId,
      },
    });

    if (userRole) {
      throw new CreateAppError({
        message: 'Role already exists for the user',
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    // 3: if role doesn't exist then create a new row in the database and assign the role to the user

    await this.prismaService.userRole.create({
      data: {
        userId: assignRoleInput.userId,
        roleId: assignRoleInput.roleId,
      },
    });

    return {
      success: true,
    };
  }
}
