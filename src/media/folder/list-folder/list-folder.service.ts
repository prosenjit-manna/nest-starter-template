import { Args, Context, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { FolderListResponse } from './list-folder.response.dto';
import { ListFolderInput } from './list-folder.input.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginationInputTransformer } from 'src/shared/base-list/base-list-input-transform';
import { Order } from 'src/shared/base-list/base-list-input.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ListFolderService {
  constructor(private prisma: PrismaService) {}


  @Query(() => FolderListResponse)
  async listFolder(
    @Context('req') req: Request,
    @Args('listFolderInput', { nullable: true }) listFolderInput: ListFolderInput,
  ): Promise<FolderListResponse> {

    const currentWorkspaceId = req.currentWorkspaceId;

    let queryObject: Prisma.FolderWhereInput = {
      workspaceId: {
        equals: currentWorkspaceId,
      },
      name: {
        contains: listFolderInput?.name || undefined,
        mode: 'insensitive',
      },
      parentId: null,
      deletedAt: listFolderInput?.fromStash
        ? {
            not: {
              not: null,
            },
          }
        : null,
    };

    queryObject = {
      ...queryObject,
    };

    const postCount = await this.prisma.folder.count({
      where: queryObject,
    });

    const paginationMeta = paginationInputTransformer({
      page: listFolderInput?.page,
      pageSize: listFolderInput?.pageSize,
      totalRowCount: postCount,
    });

    let orderByQuery: any = {
      id: Order.DESC,
    };

    if (listFolderInput?.orderByField && listFolderInput?.orderBy) {
      orderByQuery = {
        [listFolderInput.orderByField as string]: listFolderInput.orderBy,
      };
    }

    const folder = await this.prisma.folder.findMany({
      skip: paginationMeta.skip,
      take: paginationMeta.perPage,
      orderBy: orderByQuery,
      where: queryObject,
      include: {
        author: true,
      },
    });

    return {
      folder: folder,
      pagination: {
        currentPage: paginationMeta.page,
        totalPage: paginationMeta.totalPage,
        perPage: paginationMeta.perPage,
        totalRows: postCount,
      },
    };
  }
}
