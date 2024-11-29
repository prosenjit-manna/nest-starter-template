import { UseGuards, SetMetadata } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { Request } from 'express';
import * as sanitizeHtml from 'sanitize-html';

import { UpdatePostResponse } from './update-post-response.dto';
import { UpdatePostInput } from './update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostMemberShipValidation } from '../post-membership-validation';
import { WorkspaceMemberShipGuard } from 'src/auth/workspace-membership.guard';
import { MemberShipValidationType } from 'src/auth/membership-validation-type.enum';

@UseGuards(JwtAuthGuard)
@Resolver()
export class PostUpdateService {
  constructor(
    private prisma: PrismaService, 
    private postMemberShipValidation: PostMemberShipValidation
  ) {}

  @Mutation(() => UpdatePostResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.POST)
  @SetMetadata('privilegeName', PrivilegeName.UPDATE)
  
  @UseGuards(WorkspaceMemberShipGuard)
  @SetMetadata('memberShipValidationType', MemberShipValidationType.MEMBERSHIP_VALIDITY)
  
  async updatePost(
    @Args('postId') postId: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @Context('req') req: Request,
  ) {

    this.postMemberShipValidation.validateAuthorMembership(req.memberships, (updatePostInput?.authorId || req?.user?.id) || '');

    const existingPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    await this.postMemberShipValidation.validateMembership(this.prisma, req?.user?.id || '', existingPost.workspaceId);

    const post = await this.prisma.post.update({
      where: { id: postId },
      data: {...updatePostInput, content: sanitizeHtml(updatePostInput.content),},
    });
    return post;
  }
}
