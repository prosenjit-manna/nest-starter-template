import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { Request } from 'express';

import { UpdateWorkspaceResponse } from './update-workspace-response.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { PrismaService } from 'src/prisma.service';
import { UpdateWorkspaceInput } from './update-workspace-input.dto';
import { CreateAppError } from 'src/shared/create-error/create-error';

@UseGuards(JwtAuthGuard)
@Resolver()
export class UpdateWorkspaceService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => UpdateWorkspaceResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.WORKSPACE)
  @SetMetadata('privilegeName', PrivilegeName.UPDATE)
  async updateWorkspace(
    @Args('updateWorkspaceInput') updateWorkspaceInput: UpdateWorkspaceInput,
    @Context('req') req: Request,
  ): Promise<UpdateWorkspaceResponse> {
    const membership = await this.prisma.workspaceMembership.findMany({
      where: {
        userId: req?.user?.id,
      },
    });

    // Check if the user has access to the workspace
    if (!membership.some((m) => m.workspaceId === updateWorkspaceInput.id)) {
      throw new CreateAppError({
        message: 'You are not a member of this workspace',
      });
    }

    const workspace = await this.prisma.workspace.update({
      where: {
        id: updateWorkspaceInput.id,
      },
      data: {
        name: updateWorkspaceInput.name,
      },
    });

    return workspace;
  }
}
