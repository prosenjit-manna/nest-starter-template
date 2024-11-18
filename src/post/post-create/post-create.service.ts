import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreatePostResponse } from './create-post-response.dto';
import { CreatePostInput } from './create-post-input.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleGuard } from 'src/auth/role.guard';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class PostCreateService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => CreatePostResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.POST)
  @SetMetadata('privilegeName', PrivilegeName.CREATE)
  async createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
    const post = await this.prisma.post.create({
      data: createPostInput,
    });
    return post;
  }
}
