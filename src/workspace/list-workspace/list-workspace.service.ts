import { Injectable, SetMetadata, UseGuards } from '@nestjs/common';
import { Prisma, PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { Args, Context, Query } from '@nestjs/graphql';
import { Request } from 'express';

import { PrismaService } from 'src/prisma.service';
import { ListWorkSpaceResponse } from './list-workspace-response.dto';
import { ListWorkSpaceInput } from './list-workspace-input.dto';
import { paginationInputTransformer } from 'src/shared/base-list/base-list-input-transform';
import { Order } from 'src/shared/base-list/base-list-input.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';

@UseGuards(JwtAuthGuard)
@Injectable()
export class ListWorkSpaceService {
  constructor(private prisma: PrismaService) {}

  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.WORKSPACE)
  @SetMetadata('privilegeName', PrivilegeName.READ)
  @Query(() => ListWorkSpaceResponse)
  async listWorkSpace(
    @Args('listWorkspaceInput', { nullable: true })
    listWorkspaceInput: ListWorkSpaceInput,
    @Context('req') req: Request,
  ): Promise<ListWorkSpaceResponse> {
    const membership = await this.prisma.workspaceMembership.findMany({
      where: {
        userId: req?.user?.id,
        isAccepted: true,
      },
    });

    const queryObject: Prisma.WorkspaceWhereInput = {
      id: {
        in: membership.map((m) => m.workspaceId),
      },
      name: {
        contains: listWorkspaceInput?.name || undefined,
        mode: 'insensitive',
      },
      deletedAt: listWorkspaceInput?.fromStash
        ? {
            not: {
              not: null,
            },
          }
        : null,
    };

    const workspaceCount = await this.prisma.workspace.count({
      where: queryObject,
    });

    const paginationMeta = paginationInputTransformer({
      page: listWorkspaceInput?.page,
      pageSize: listWorkspaceInput?.pageSize,
      totalRowCount: workspaceCount,
    });

    let orderByQuery: any = {
      id: Order.DESC,
    };

    if (listWorkspaceInput?.orderByField && listWorkspaceInput?.orderBy) {
      orderByQuery = {
        [listWorkspaceInput.orderByField as string]: listWorkspaceInput.orderBy,
      };
    }

    const workspaceList = await this.prisma.workspace.findMany({
      skip: paginationMeta.skip,
      take: paginationMeta.perPage,
      orderBy: orderByQuery,
      where: {
        ...queryObject,
      },
    });

    return {
      workspace: workspaceList,
      pagination: {
        currentPage: paginationMeta.page,
        totalPage: paginationMeta.totalPage,
        perPage: paginationMeta.perPage,
        totalRows: workspaceCount,
      },
    };
  }
}

