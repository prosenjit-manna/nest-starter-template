import { SetMetadata, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';

import { CreatePostResponse } from './create-post-response.dto';
import { CreatePostInput } from './create-post-input.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { PostMemberShipValidation } from '../post-membership-validation';

@UseGuards(JwtAuthGuard)
@Resolver()
export class PostCreateService {
  constructor(
    private prisma: PrismaService,
    private postMemberShipValidation: PostMemberShipValidation,
  ) {}

  @Mutation(() => CreatePostResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.POST)
  @SetMetadata('privilegeName', PrivilegeName.CREATE)

  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context('req') req: Request,
  ) {

    const membership = await this.postMemberShipValidation.validateMembership(req?.user?.id || '', createPostInput.workSpaceId);
    this.postMemberShipValidation.validateAuthorMembership(membership, (createPostInput?.authorId || req?.user?.id) || '');


    const post = await this.prisma.post.create({
      data: {
        ...createPostInput,
        authorId: createPostInput.authorId || req?.user?.id,
        workspaceId: createPostInput.workSpaceId,
      },
    });
    return post;
  }
}
