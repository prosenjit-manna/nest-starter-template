import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreatePostInput } from './create-post.dto';
import { CreatePostResponse } from './create-post-response.dto';
import { UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/validator.pipe';
import { GetPostListInput} from './get-post-list-input.dto';
import { PostListResponse } from './post-list-response.dto';
import { Prisma } from '@prisma/client';
import { paginationInputTransformer } from 'src/shared/base-list/base-list-input-transform';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Order } from 'src/shared/base-list/base-list-input.dto';
@Resolver()
@UseGuards(JwtAuthGuard)
export class PostService {
  constructor(private prisma: PrismaService) {}

  @Query(() => PostListResponse)
  async getPostList(
    @Args('getPostListInput', { nullable: true })
    getPostListInput: GetPostListInput,
  ) {
    const queryObject: Prisma.PostWhereInput = {
      title: {
        contains: getPostListInput?.title || undefined,
        mode: 'insensitive',
      },
      authorId: {
        equals: getPostListInput?.authorId,
      }
    };

    const postCount = await this.prisma.post.count({
      where: queryObject,
    });

    const paginationMeta = paginationInputTransformer({
      page: getPostListInput?.page,
      pageSize: getPostListInput?.pageSize,
      totalRowCount: postCount,
    });

    let orderByQuery: any = {
      id: Order.DESC,
    };

    if (getPostListInput?.orderByField && getPostListInput?.orderBy) {
      orderByQuery = {
        [getPostListInput.orderByField as string]: getPostListInput.orderBy,
      };
    }
    

    const posts = await this.prisma.post.findMany({
      skip: paginationMeta.skip,
      take: paginationMeta.perPage,
      orderBy: orderByQuery,
      where: {
        ...queryObject,
      },
      include: { author: true },
    });


    return {
      posts: posts,
      pagination: {
        currentPage: paginationMeta.page,
        totalPage: paginationMeta.totalPage,
        perPage: paginationMeta.perPage,
      }
    };
  }

  @Mutation(() => CreatePostResponse)
  @UsePipes(new ValidationPipe())
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
  ) {
    const post = await this.prisma.post.create({
      data: createPostInput,
    });
    return post;
  }
}
