import { Resolver, Query } from '@nestjs/graphql';
import { PrivilegeType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PrivilegeListResponse } from './list-privilege.response.dto';

@Resolver()
export class ListPrivilegeService {
  constructor(private prisma: PrismaService) {}

  @Query(() => PrivilegeListResponse)
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
