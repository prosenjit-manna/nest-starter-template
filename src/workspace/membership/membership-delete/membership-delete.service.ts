import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { MembershipDeleteInput } from './membership-delete-input.dto';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WorkspaceMemberShipGuard } from 'src/auth/workspace-membership.guard';
import { MemberShipValidationType } from 'src/auth/membership-validation-type.enum';

@UseGuards(JwtAuthGuard)
@Resolver()
export class MembershipDeleteService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.MEMBERSHIP)
  @SetMetadata('privilegeName', PrivilegeName.DELETE)

  @UseGuards(WorkspaceMemberShipGuard)
  @SetMetadata('memberShipValidationType', MemberShipValidationType.MEMBERSHIP_VALIDITY)

  async deleteMembership(
    @Context('req') req: Request,
    @Args('membershipDeleteInput', { nullable: true }) membershipDeleteInput: MembershipDeleteInput,
  ): Promise<boolean> {

    const membership = await this.prismaService.workspaceMembership.findUnique({
      where: { id: membershipDeleteInput.id, deletedAt: membershipDeleteInput.fromStash ? { not: null } : null },
    });


    if (!membership) {
      throw new CreateAppError({
        message: 'Membership not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    try {
      if (membershipDeleteInput.fromStash) {
        await this.prismaService.workspaceMembership.delete({ where: { id: membershipDeleteInput.id } });
      } else {
        await this.prismaService.workspaceMembership.update({
          where: { id: membershipDeleteInput.id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
      }

      return true;
    } catch (error) {
      throw new CreateAppError({
        message: 'Unable to Delete Post',
        httpStatus: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }
}
