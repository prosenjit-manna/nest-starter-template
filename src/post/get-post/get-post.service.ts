import { Args, Resolver, Query } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { GetPostInput } from './get-post-input.dto';
import { GetPostResponse } from './get-post-response.dto';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { HttpStatus } from '@nestjs/common';

@Resolver()
export class GetPostService {
  constructor(private prisma: PrismaService) {}

  @Query(() => GetPostResponse, { nullable: true })
  async getPost(@Args('getPostInput') getPostInput: GetPostInput) {
    const post = await this.prisma.post.findFirst({
      where: {
        id: getPostInput.id,
      },
    });

    if (!post) {
      throw new CreateAppError({
        message: 'Post not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }
    return post;
  }
}
