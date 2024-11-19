import { UseGuards, SetMetadata } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { Request } from 'express';

import { UpdatePostResponse } from './update-post-response.dto';
import { UpdatePostInput } from './update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class PostUpdateService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => UpdatePostResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.POST)
  @SetMetadata('privilegeName', PrivilegeName.UPDATE)
  async updatePost(
    @Args('postId') postId: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @Context('req') req: Request,
  ) {

    const membership = await this.prisma.workspaceMembership.findMany({
      where: {
        userId: req?.user?.id,
        isAccepted: true,
      },
    });

    if (!membership.some((m) => m.userId === updatePostInput.authorId)) {
      throw new Error('Membership not available for this author');
    }

    const post = await this.prisma.post.update({
      where: { id: postId },
      data: updatePostInput,
    });
    return post;
  }
}
