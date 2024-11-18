import { UseGuards, SetMetadata } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UpdatePostResponse } from './update-post-response.dto';
import { UpdatePostInput } from './update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleGuard } from 'src/auth/role.guard';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
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
  ) {
    const post = await this.prisma.post.update({
      where: { id: postId },
      data: updatePostInput,
    });
    return post;
  }
}
