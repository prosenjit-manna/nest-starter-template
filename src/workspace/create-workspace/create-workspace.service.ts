import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { Request } from 'express';

import { CreateWorkspaceResponse } from './create-workspace-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkspaceInput } from './create-workspace-input.dto';

@UseGuards(JwtAuthGuard)
@Resolver()
export class CreateWorkspaceService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => CreateWorkspaceResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.WORKSPACE)
  @SetMetadata('privilegeName', PrivilegeName.CREATE)
  async createWorkspace(
    @Args('createWorkspaceInput') createWorkspaceInput: CreateWorkspaceInput,
    @Context('req') req: Request,
  ): Promise<CreateWorkspaceResponse> {
    const workspace = await this.prisma.workspace.create({
      data: {
        name: createWorkspaceInput.name,
      },
    });

    await this.prisma.workspaceMembership.create({
      data: {
        // User ID can not be blank it is just for type safety
        userId: req?.user?.id || '',
        workspaceId: workspace.id,
        isAccepted: true,
        isOwner: true,
      },
    });

    return workspace;
  }
}
