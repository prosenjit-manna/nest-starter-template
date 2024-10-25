import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

/** 
 * Usage of this guard 
 * 
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.ROLE)
  @SetMetadata('privilegeName', PrivilegeName.READ)
 * 
 */

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // Retrieve roles metadata set by `@SetMetadata`
    const privilegeGroup = this.reflector.get<string>('privilegeGroup', context.getHandler());
    const privilegeName = this.reflector.get<string>('privilegeName', context.getHandler());

    const ctx = GqlExecutionContext.create(context);

    // Retrieve user from request object
    const request = ctx.getContext().req as Request;

    const user = request.user;


    if (!user) {
      return false;
    }

    // console.log('user', user);

    // Retrieve roles data from database
    const rolesData = await this.prisma.userRole.findMany({
      where: {
        userId: user.id
      }
    });

    // Retrieve privileges data from database
    const privileges = await this.prisma.rolePrivilege.findMany({
      where: {
        roleId: {
          in: rolesData?.map(role => role.roleId)
        },
      },
      include: {
        privilege: true
      }
    });
    
    // console.log('rolesData', rolesData);
    // console.log('privileges', privileges);

    // create a array of flat privileges
    const privilegesFlatArr: any[] = [];
    
    privileges.forEach(p => {
      privilegesFlatArr.push({
        id: p.privilege.id,
        name: p.privilege.name,
        group: p.privilege.group,
        type: p.privilege.type
      });
    });

    // console.log('privileges Arr', privilegesFlatArr);

    // Check if user has the required privilege
    const hasPrivilege = privilegesFlatArr.some(p => p.group === privilegeGroup && p.name === privilegeName);
    // console.log('hasPrivilege', hasPrivilege);

   return hasPrivilege;
  }
}
