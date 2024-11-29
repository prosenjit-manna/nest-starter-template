import { SetMetadata, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';

import { RoleCreateResponse } from './role-create-response.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleCreateInput } from './role-create-input.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { WorkspaceMemberShipGuard } from 'src/auth/workspace-membership.guard';
import { MemberShipValidationType } from 'src/auth/membership-validation-type.enum';

@UseGuards(JwtAuthGuard)
@Resolver()
export class RoleCreateService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => RoleCreateResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.ROLE)
  @SetMetadata('privilegeName', PrivilegeName.CREATE)

  @UseGuards(WorkspaceMemberShipGuard)
  @SetMetadata('memberShipValidationType', MemberShipValidationType.MEMBERSHIP_VALIDITY)

  async createRole(
    @Args('roleCreateInput') roleCreateInput: RoleCreateInput,
    @Context('req') req: Request,
  ): Promise<RoleCreateResponse> {
    const role = await this.prisma.role.create({
      data: {
        name: roleCreateInput.name,
        title: roleCreateInput.title,
        description: roleCreateInput.description,
        workspaceId: req.currentWorkspaceId,
      },
    });


    // assign base privileges to the role

    await this.prisma.rolePrivilege.createMany({
      data: roleCreateInput.privileges.map((privilege) => ({
        roleId: role.id,
        privilegeId: privilege,
      })),
    });

    return role;
  }
}
