import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { PrivilegeGroup, PrivilegeName, RoleType, UserType } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { RoleDeleteInput } from './role-delete-input.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class RoleDeleteService {
  constructor(private prismaService: PrismaService) {}

  @Mutation(() => Boolean)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.ROLE)
  @SetMetadata('privilegeName', PrivilegeName.DELETE)
  async deleteRole(
    @Args('roleDeleteInput', { nullable: true }) roleDeleteInput: RoleDeleteInput,
    @Context('req') req: Request,
  ): Promise<boolean> {

    const role = await this.prismaService.role.findUnique({
      where: { id: roleDeleteInput.id, deletedAt: roleDeleteInput.fromStash ? { not: null } : null },
    });

   

    if (!role) {
      throw new CreateAppError({
        message: 'Role not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    if (req.user?.userType !== UserType.SUPER_ADMIN && role?.type !== RoleType.CUSTOM) {
      throw new CreateAppError({ message: 'You are not allowed to delete this role. Only Custom role can be deleted.'});
    }

    try {
      if (roleDeleteInput.fromStash) {
        await this.prismaService.role.delete({ where: { id: roleDeleteInput.id } });
      } else {
        await this.prismaService.role.update({
          where: { id: roleDeleteInput.id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
      }

      return true;
    } catch (error) {
      throw new CreateAppError({
        message: 'Unable to Delete Role',
        httpStatus: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }
}
