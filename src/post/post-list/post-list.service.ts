
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Args, Query } from '@nestjs/graphql';

import { PrismaService } from 'src/prisma.service';
import { PostListResponse } from './post-list-response.dto';
import { GetPostListInput } from './get-post-list-input.dto';
import { paginationInputTransformer } from 'src/shared/base-list/base-list-input-transform';
import { Order } from 'src/shared/base-list/base-list-input.dto';

@Injectable()
export class PostListService {
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
}