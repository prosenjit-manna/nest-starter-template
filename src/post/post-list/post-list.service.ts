
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Args, Context, Query } from '@nestjs/graphql';
import { Request } from 'express';

import { PrismaService } from 'src/prisma.service';
import { PostListResponse } from './post-list-response.dto';
import { GetPostListInput } from './get-post-list-input.dto';
import { paginationInputTransformer } from 'src/shared/base-list/base-list-input-transform';
import { Order } from 'src/shared/base-list/base-list-input.dto';
import { appConfig } from 'src/app.config';

@Injectable()
export class PostListService {
  constructor(private prisma: PrismaService) {}
    
  @Query(() => PostListResponse)
  async getPostList(
    @Context('req') req: Request,
    @Args('getPostListInput', { nullable: true }) getPostListInput: GetPostListInput,
  ): Promise<PostListResponse> {

    const currentWorkspaceId = req.headers[appConfig.current_workspace_id] as string | undefined;
    
    let queryObject: Prisma.PostWhereInput = {
      workspaceId: {
        equals: currentWorkspaceId,
      },
      title: {
        contains: getPostListInput?.title || undefined,
        mode: 'insensitive',
      },
      authorId: {
        equals: getPostListInput?.authorId,
      },
      deletedAt: getPostListInput?.fromStash ? {
        not: {
          not: null,
        }
      } : null,
    };

    queryObject = {
      ...queryObject,
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
      where: queryObject,
      include: {
        author: true,
      }
    });

    
    return {
      posts: posts,
      pagination: {
        currentPage: paginationMeta.page,
        totalPage: paginationMeta.totalPage,
        perPage: paginationMeta.perPage,
        totalRows: postCount,
      }
    };
  }
}
