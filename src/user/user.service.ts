import { Context, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';
import { CurrentUserResponse } from './current-user.response.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolePrivilegeResponse } from 'src/roles/get-role/role-get-response.dto';
import { orderBy, unionBy } from 'lodash';

@UseGuards(JwtAuthGuard)
@Resolver()
export class UserService {
  constructor(private prisma: PrismaService) {}

  @Query(() => CurrentUserResponse)
  async currentUser(@Context('req') req: Request): Promise<CurrentUserResponse> {
    const user = await this.prisma.user.findFirst({ 
      where: {
        id: req.jwt.userId
      },
      include: {
        session: true
      }
    });
    if (!user) {
      throw new Error('User not found');
    }


    const roles = await this.prisma.userRole.findMany({
      where: {
        userId: req.jwt.userId
      }
    });

    const transformPrivileges: RolePrivilegeResponse[] = [];

    const privileges = await this.prisma.rolePrivilege.findMany({
      where: { roleId: {
        in: roles.map(role => role.roleId)
      } },
      include: { privilege: true },
    });
    

    privileges.forEach((privilege) => {
      transformPrivileges.push({
        id: privilege.privilege.id,
        name: privilege.privilege.name,
        group: privilege.privilege.group,
        type: privilege.privilege.type || '',
      });
    });

    return  {
      ...user,
      sessionCount: user.session.length,
      privilege: orderBy(unionBy(transformPrivileges,  item => `${item.group}-${item.name}`), ['group'], ['asc']),
      roles: roles.map(role => role.roleId)
    };
  }

 
  @Query(() => [CurrentUserResponse])
  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }


}
