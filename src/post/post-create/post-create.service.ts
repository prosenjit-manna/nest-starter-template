import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { CreatePostResponse } from './create-post-response.dto';
import { CreatePostInput } from './create-post-input.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostCreateService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => CreatePostResponse)
  @UsePipes(new ValidationPipe())
  async createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
    const post = await this.prisma.post.create({
      data: createPostInput,
    });
    return post;
  }
}
