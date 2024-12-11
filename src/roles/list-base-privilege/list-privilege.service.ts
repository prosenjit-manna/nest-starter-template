import { Resolver, Query } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName, PrivilegeType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrivilegeListResponse } from './list-privilege.response.dto';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class ListPrivilegeService {
  constructor(private prisma: PrismaService) {}

  @Query(() => PrivilegeListResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.ROLE)
  @SetMetadata('privilegeName', PrivilegeName.READ)
  async listBasePrivilege(): Promise<PrivilegeListResponse> {
    const privilegesList = await this.prisma.privilege.findMany({
      where: {
        type: PrivilegeType.BASE,
      },
    });


    return {
      privilege: privilegesList,
    };
  }
}
