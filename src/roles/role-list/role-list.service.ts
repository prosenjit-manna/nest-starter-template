import { Injectable, SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { RoleListResponse } from './role-list.response.dto';
import { Prisma, PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { Order } from 'src/shared/base-list/base-list-input.dto';
import { paginationInputTransformer } from 'src/shared/base-list/base-list-input-transform';
import { RoleListInput } from './role-list-input.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';

@Injectable()
@UseGuards(JwtAuthGuard)

export class RoleListService {
  constructor(private prisma: PrismaService) {}

  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.ROLE)
  @SetMetadata('privilegeName', PrivilegeName.READ)
  
  @Query(() => RoleListResponse)
  async roleList(
    @Args('roleListInput', { nullable: true })
    roleListInput: RoleListInput,
  ): Promise<RoleListResponse> {
    const queryObject: Prisma.RoleWhereInput = {
      title: {
        contains: roleListInput?.title || undefined,
        mode: 'insensitive',
      },
    };

    const rolesCount = await this.prisma.role.count({
      where: queryObject,
    });

    const paginationMeta = paginationInputTransformer({
      page: roleListInput?.page,
      pageSize: roleListInput?.pageSize,
      totalRowCount: rolesCount,
    });

    let orderByQuery: any = {
      createdAt: Order.DESC,
    };

    if (roleListInput?.orderByField && roleListInput?.orderBy) {
      orderByQuery = {
        [roleListInput.orderByField as string]: roleListInput.orderBy,
      };
    }

    const roles = await this.prisma.role.findMany({
      skip: paginationMeta.skip,
      take: paginationMeta.perPage,
      orderBy: orderByQuery,
      where: {
        ...queryObject,
      },
    });


    return {
      role: roles,
      pagination: {
        currentPage: paginationMeta.page,
        totalPage: paginationMeta.totalPage,
        perPage: paginationMeta.perPage,
      },
    };
  }
}
