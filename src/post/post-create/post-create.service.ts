import { SetMetadata, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';

import { CreatePostResponse } from './create-post-response.dto';
import { CreatePostInput } from './create-post-input.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostMemberShipValidation } from '../post-membership-validation';
import { WorkspaceMemberShipGuard } from 'src/auth/workspace-membership.guard';
import { MemberShipValidationType } from 'src/auth/membership-validation-type.enum';
import * as sanitizeHtml from 'sanitize-html';

@UseGuards(JwtAuthGuard)
@Resolver()
export class PostCreateService {
  constructor(
    private postMemberShipValidation: PostMemberShipValidation,
    private prisma: PrismaService,
  ) {}

  @Mutation(() => CreatePostResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.POST)
  @SetMetadata('privilegeName', PrivilegeName.CREATE)

  @UseGuards(WorkspaceMemberShipGuard)
  @SetMetadata('memberShipValidationType', MemberShipValidationType.MEMBERSHIP_VALIDITY)

  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context('req') req: Request,
  ) {

    if (createPostInput.authorId) {
      await this.postMemberShipValidation.validateMembership(this.prisma, createPostInput?.authorId, req.currentWorkspaceId || '');
    }
    

    const post = await this.prisma.post.create({
      data: {
        ...createPostInput,
        content: sanitizeHtml(createPostInput.content),
        authorId: createPostInput.authorId || req?.user?.id,
        workspaceId: req.currentWorkspaceId || '',
      },
    });
    return post;
  }
}
