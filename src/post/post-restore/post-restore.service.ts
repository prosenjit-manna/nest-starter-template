import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { PostRestoreInput } from './post-restore-input.dto';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WorkspaceMemberShipGuard } from 'src/auth/workspace-membership.guard';
import { MemberShipValidationType } from 'src/auth/membership-validation-type.enum';

@UseGuards(JwtAuthGuard)
@Resolver()
export class PostRestoreService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.POST)
  @SetMetadata('privilegeName', PrivilegeName.DELETE)

  @UseGuards(WorkspaceMemberShipGuard)
  @SetMetadata('memberShipValidationType', MemberShipValidationType.MEMBERSHIP_VALIDITY)

  async restore(
    @Context('req') req: Request,
    @Args('postRestoreInput', { nullable: true }) postRestoreInput: PostRestoreInput,
  ): Promise<boolean> {

    const post = await this.prismaService.post.findUnique({
      where: { id: postRestoreInput.id, deletedAt: { not: null }  },
    });


    if (!post) {
      throw new CreateAppError({
        message: 'Post not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    try {
      await this.prismaService.post.update({
        where: { id: postRestoreInput.id },
        data: { deletedAt: null },
      });

      return true;
    } catch (error) {
      throw new CreateAppError({
        message: 'Unable to restore Post',
        httpStatus: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }
}
