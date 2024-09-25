import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { UpdatePostResponse } from './update-post-response.dto';
import { UpdatePostInput } from './update-post.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostUpdateService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => UpdatePostResponse)
  @UsePipes(new ValidationPipe())
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
