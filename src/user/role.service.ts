import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentPrivilegeResponse } from './priviege.response.dto';
import { PrismaService } from 'src/prisma.service';

@UseGuards(JwtAuthGuard)
@Resolver()
export class RoleService {
    constructor(private prisma: PrismaService) {}

    @Query(() => [CurrentPrivilegeResponse])
    async currentUserPrivileges(@Context('req') req: Request) {
      const roles = req.user?.UserRole.map((role) => role.roleId as string)
      
      const userRolePrivilege  = await this.prisma.privilege.findMany({
        where: {
          roleId: {
            in: roles?.length ? roles : [''],
          }
        },
      });
  
      return userRolePrivilege;
    }
  
}
