import { Args, Context, Query, Resolver } from "@nestjs/graphql";
import { Request } from "express";
import { UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "src/prisma/prisma.service";
import { ListMediaInput } from "./list-file.input.dto";
import { ListMediaResponse } from "./list-file.response.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { paginationInputTransformer } from "src/shared/base-list/base-list-input-transform";
import { Order } from "src/shared/base-list/base-list-input.dto";

@UseGuards(JwtAuthGuard)
@Resolver()
export class ListMediaService {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => ListMediaResponse)
  async listMedia(
    @Context('req') req: Request,
    @Args('listMediaInput', { nullable: true }) listMediaInput: ListMediaInput,
  ): Promise<ListMediaResponse> {
    const currentWorkspaceId = req.currentWorkspaceId;
    
    let queryObject: Prisma.FileWhereInput = {
      workspaceId: {
        equals: currentWorkspaceId,
      },
      deletedAt: listMediaInput?.fromStash ? {
        not: {
          not: null,
        }
      } : null,
    };

    queryObject = {
      ...queryObject,
    };


    const fileCount = await this.prisma.file.count({
      where: queryObject,
    });

    const paginationMeta = paginationInputTransformer({
      page: listMediaInput?.page,
      pageSize: listMediaInput?.pageSize,
      totalRowCount: fileCount,
    });

    let orderByQuery: any = {
      id: Order.DESC,
    };

    if (listMediaInput?.orderByField && listMediaInput?.orderBy) {
      orderByQuery = {
        [listMediaInput.orderByField as string]: listMediaInput.orderBy,
      };
    }
    

    const file = await this.prisma.file.findMany({
      skip: paginationMeta.skip,
      take: paginationMeta.perPage,
      orderBy: orderByQuery,
      where: queryObject,
    });

    
  
    return {
      file: file,
      pagination: {
        currentPage: paginationMeta.page,
        totalPage: paginationMeta.totalPage,
        perPage: paginationMeta.perPage,
        totalRows: fileCount,
      },
    }

    
  }
}