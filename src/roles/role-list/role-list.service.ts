import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { RoleListResponse } from './role-list.response.dto';
import { Prisma } from '@prisma/client';
import { Order } from 'src/shared/base-list/base-list-input.dto';
import { paginationInputTransformer } from 'src/shared/base-list/base-list-input-transform';
import { RoleListInput } from './role-list-input.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Injectable()
@UseGuards(JwtAuthGuard)
export class RoleListService {
  constructor(private prisma: PrismaService) {}

  @Query(() => RoleListResponse)
  async roleList(
    @Args('roleListInput', { nullable: true })
    getPostListInput: RoleListInput,
  ): Promise<RoleListResponse> {
    const queryObject: Prisma.RoleWhereInput = {
      title: {
        contains: getPostListInput?.title || undefined,
        mode: 'insensitive',
      },
    };

    const postCount = await this.prisma.role.count({
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
    

    const posts = await this.prisma.role.findMany({
      skip: paginationMeta.skip,
      take: paginationMeta.perPage,
      orderBy: orderByQuery,
      where: {
        ...queryObject,
      },
    });


    return {
      role: posts,
      pagination: {
        currentPage: paginationMeta.page,
        totalPage: paginationMeta.totalPage,
        perPage: paginationMeta.perPage,
      }
    };
  }
}
