
import { Injectable, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Args, Query } from '@nestjs/graphql';

import { PrismaService } from 'src/prisma.service';
import { ListWorkSpaceResponse } from './list-workspace-response.dto';
import { ListWorkSpaceInput } from './list-workspace-input.dto';
import { paginationInputTransformer } from 'src/shared/base-list/base-list-input-transform';
import { Order } from 'src/shared/base-list/base-list-input.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Injectable()
export class ListWorkSpaceService {
  constructor(private prisma: PrismaService) {}
    
  @Query(() => ListWorkSpaceResponse)
  async listWorkSpace(
    @Args('listWorkspaceInput', { nullable: true })
    listWorkspaceInput: ListWorkSpaceInput,
  ): Promise<ListWorkSpaceResponse> {

    const queryObject: Prisma.WorkspaceWhereInput = {
      name: {
        contains: listWorkspaceInput?.name || undefined,
        mode: 'insensitive',
      },
      deletedAt: listWorkspaceInput?.fromStash ? {
        not: {
          not: null,
        }
      } : null,
    };

    const postCount = await this.prisma.workspace.count({
      where: queryObject,
    });

    const paginationMeta = paginationInputTransformer({
      page: listWorkspaceInput?.page,
      pageSize: listWorkspaceInput?.pageSize,
      totalRowCount: postCount,
    });

    let orderByQuery: any = {
      id: Order.DESC,
    };

    if (listWorkspaceInput?.orderByField && listWorkspaceInput?.orderBy) {
      orderByQuery = {
        [listWorkspaceInput.orderByField as string]: listWorkspaceInput.orderBy,
      };
    }
    

    const posts = await this.prisma.workspace.findMany({
      skip: paginationMeta.skip,
      take: paginationMeta.perPage,
      orderBy: orderByQuery,
      where: {
        ...queryObject,
      },
    });
    
    return {
      workspace: posts,
      pagination: {
        currentPage: paginationMeta.page,
        totalPage: paginationMeta.totalPage,
        perPage: paginationMeta.perPage,
      }
    };
  }
}
