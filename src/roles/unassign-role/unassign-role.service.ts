import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';

import { UnAssignRoleResponse } from './unassign-role-response.dto';
import { UnAssignRoleInput } from './unassign-role-input.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';

@Resolver()
@UseGuards(JwtAuthGuard)
export class UnAssignRoleService {
  constructor(private readonly prismaService: PrismaService) {}

  @Mutation(() => UnAssignRoleResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.ROLE)
  @SetMetadata('privilegeName', PrivilegeName.UPDATE)
  async unAssignRole(
    @Args('unAssignRoleInput') assignRoleInput: UnAssignRoleInput,
  ): Promise<UnAssignRoleResponse> {


    const userRole = await this.prismaService.userRole.findFirst({
      where: {
        userId: assignRoleInput.userId,
        roleId: assignRoleInput.roleId,
      },
    });

    if (!userRole) {
      throw new CreateAppError({
        message: 'Mentioned not assigned to the user',
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    await this.prismaService.userRole.delete({
      where: {
       id: userRole?.id,
      },
    });
 

    return {
      success: true,
    };
  }
}
