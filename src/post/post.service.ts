import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PostResponse } from './post-response.dto';
import { CreatePostInput } from './create-post.dto';
import { CreatePostResponse } from './create-post-response.dto';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/validator.pipe';

@Resolver()
export class PostService {
  constructor(private prisma: PrismaService) {}

  @Query(() => [PostResponse])
  async getPostList(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({ 
        include: { author: true },
    });
    return posts;
  }

  @Mutation(() => CreatePostResponse)
  @UsePipes(new ValidationPipe())
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
  ): Promise<Post> {
    const post = await this.prisma.post.create({ data: createPostInput as any });
    return post;
  }

}
