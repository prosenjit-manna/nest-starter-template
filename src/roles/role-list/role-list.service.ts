import { SetMetadata, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { Prisma, PrivilegeGroup, PrivilegeName } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { RoleListResponse } from './role-list.response.dto';
import { Order } from 'src/shared/base-list/base-list-input.dto';
import { paginationInputTransformer } from 'src/shared/base-list/base-list-input-transform';
import { RoleListInput } from './role-list-input.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { WorkspaceMemberShipGuard } from 'src/auth/workspace-membership.guard';
import { MemberShipValidationType } from 'src/auth/membership-validation-type.enum';

@Resolver()
@UseGuards(JwtAuthGuard)
export class RoleListService {
  constructor(private prisma: PrismaService) {}
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.ROLE)
  @SetMetadata('privilegeName', PrivilegeName.READ)

  @UseGuards(WorkspaceMemberShipGuard)
  @SetMetadata('memberShipValidationType', MemberShipValidationType.MEMBERSHIP_VALIDITY)
  
  @Query(() => RoleListResponse)
  async roleList(
    @Args('roleListInput', { nullable: true }) roleListInput: RoleListInput,
    @Context('req') req: Request,
  ): Promise<RoleListResponse> {
    
    
    const queryObject: Prisma.RoleWhereInput = {
      title: {
        contains: roleListInput?.title || undefined,
        mode: 'insensitive',
      },
      deletedAt: roleListInput?.fromStash ? {
        not: {
          not: null,
        }
      } : null,
      OR: [
        {
          workspaceId: req.currentWorkspaceId,
        },
        {
          workspaceId: null,
        },
      ]
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
        totalRows: rolesCount,
      },
    };
  }
}
