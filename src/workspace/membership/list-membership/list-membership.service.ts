import { Args, Query, Resolver } from '@nestjs/graphql';
import { SetMetadata } from '@nestjs/common';
import { Prisma, PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { UseGuards } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { ListMembershipResponse } from './list-membership-response.dto';
import { ListMembershipInput } from './list-membership-input.dto';
import { paginationInputTransformer } from 'src/shared/base-list/base-list-input-transform';
import { Order } from 'src/shared/base-list/base-list-input.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { WorkspaceMemberShipGuard } from 'src/auth/workspace-membership.guard';
import { MemberShipValidationType } from 'src/auth/membership-validation-type.enum';


@UseGuards(JwtAuthGuard)
@Resolver()
export class ListMembershipService {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.MEMBERSHIP)
  @SetMetadata('privilegeName', PrivilegeName.READ)

  @UseGuards(WorkspaceMemberShipGuard)
  @SetMetadata('memberShipValidationType', MemberShipValidationType.MEMBERSHIP_VALIDITY)

  @Query(() => ListMembershipResponse)
  async listMemberships(
    @Args('listMembershipsInput') listMembershipsInput: ListMembershipInput,
  ): Promise<ListMembershipResponse> {

    const queryObject: Prisma.WorkspaceMembershipWhereInput = {
      workspaceId: listMembershipsInput.workspaceId,
      user: {
        name: {
          contains: listMembershipsInput.search,
          mode: 'insensitive', 
        },
      },
      deletedAt: listMembershipsInput?.fromStash ? {
        not: {
          not: null,
        }
      } : null,
    };
    

    const postCount = await this.prisma.workspaceMembership.count({
      where: queryObject,
    });

    const paginationMeta = paginationInputTransformer({
      page: listMembershipsInput?.page,
      pageSize: listMembershipsInput?.pageSize,
      totalRowCount: postCount,
    });

    let orderByQuery: any = {
      id: Order.DESC,
    };

    if (listMembershipsInput?.orderByField && listMembershipsInput?.orderBy) {
      orderByQuery = {
        [listMembershipsInput.orderByField as string]:
          listMembershipsInput.orderBy,
      };
    }

    const memberships = await this.prisma.workspaceMembership.findMany({
      where: queryObject,
      orderBy: orderByQuery,
      skip: paginationMeta.skip,
      take: paginationMeta.perPage,
      include: {
        user: true,
      }
    });


    return {
      memberships: memberships,
      pagination: {
        currentPage: paginationMeta.page,
        totalPage: paginationMeta.totalPage,
        perPage: paginationMeta.perPage,
        totalRows: postCount,
      },
    };
  }
}
