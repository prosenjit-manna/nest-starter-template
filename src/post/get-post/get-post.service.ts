import { Args, Resolver, Query, Context } from '@nestjs/graphql';
import { Request } from 'express';
import { HttpStatus } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { GetPostInput } from './get-post-input.dto';
import { GetPostResponse } from './get-post-response.dto';
import { CreateAppError } from 'src/shared/create-error/create-error';

@Resolver()
export class GetPostService {
  constructor(
    private prisma: PrismaService,
  ) {}

  @Query(() => GetPostResponse, { nullable: true })
  async getPost(
    @Context('req') req: Request,
    @Args('getPostInput') getPostInput: GetPostInput,
  ) {
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
