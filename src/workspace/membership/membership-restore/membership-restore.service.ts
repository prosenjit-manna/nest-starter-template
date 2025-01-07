import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { MemberShipRestoreInput } from './membership-restore-input.dto';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WorkspaceMemberShipGuard } from 'src/auth/workspace-membership.guard';
import { MemberShipValidationType } from 'src/auth/membership-validation-type.enum';

@UseGuards(JwtAuthGuard)
@Resolver()
export class MembershipRestoreService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.MEMBERSHIP)
  @SetMetadata('privilegeName', PrivilegeName.DELETE)

  @UseGuards(WorkspaceMemberShipGuard)
  @SetMetadata('memberShipValidationType', MemberShipValidationType.MEMBERSHIP_VALIDITY)

  async restoreMembership(
    @Context('req') req: Request,
    @Args('membershipDeleteInput', { nullable: true }) membershipDeleteInput: MemberShipRestoreInput,
  ): Promise<boolean> {

    const membership = await this.prismaService.workspaceMembership.findUnique({
      where: { id: membershipDeleteInput.id, deletedAt: { not: null }  },
    });


    if (!membership) {
      throw new CreateAppError({
        message: 'Membership not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    try {
      await this.prismaService.workspaceMembership.update({
        where: { id: membershipDeleteInput.id },
        data: { deletedAt: null },
      });

      return true;
    } catch (error) {
      throw new CreateAppError({
        message: 'Unable to restore Membership',
        httpStatus: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }
}
