import { SetMetadata, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';

import { CreatePostResponse } from './create-post-response.dto';
import { CreatePostInput } from './create-post-input.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class PostCreateService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => CreatePostResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.POST)
  @SetMetadata('privilegeName', PrivilegeName.CREATE)

  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context('req') req: Request,
  ) {

    const membership = await this.prisma.workspaceMembership.findMany({
      where: {
        userId: req?.user?.id,
        isAccepted: true,
      },
    });

    if (!membership.some((m) => m.workspaceId === createPostInput.workSpaceId)) {
      throw new Error('Membership not available for this workspace');
    }

    if (!membership.some((m) => m.userId === createPostInput.authorId)) {
      throw new Error('Membership not available for this author');
    }


    const post = await this.prisma.post.create({
      data: {
        ...createPostInput,
        authorId: createPostInput.authorId || req?.user?.id,
      },
    });
    return post;
  }
}
