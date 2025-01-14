import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { WorkspaceDeleteInput } from './workspace-delete-input.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class DeleteWorkSpaceService {
  constructor(private prismaService: PrismaService) {}

  @Mutation(() => Boolean)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.WORKSPACE)
  @SetMetadata('privilegeName', PrivilegeName.DELETE)
  async deleteWorkSpace(
    @Args('deleteWorkspaceInput', { nullable: true })
    deleteWorkspaceInput: WorkspaceDeleteInput,
    @Context('req') req: Request,
  ): Promise<boolean> {

    const membership = await this.prismaService.workspaceMembership.findMany({
      where: {
        userId: req?.user?.id,
      }
    });

    // Check if the user has access to the workspace
    if (!membership.some((m) => m.workspaceId === deleteWorkspaceInput.id)) {
      throw new CreateAppError({
        message: 'You are not a member of this workspace',
      });
    }

    const workspace = await this.prismaService.workspace.findUnique({
      where: {
        id: deleteWorkspaceInput.id,
        deletedAt: deleteWorkspaceInput.fromStash ? { not: null } : null,
      },
    });

    if (!workspace) {
      throw new CreateAppError({
        message: 'Workspace not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    try {
      if (deleteWorkspaceInput.fromStash) {
        await this.prismaService.workspace.delete({
          where: { id: deleteWorkspaceInput.id },
        });
      } else {
        await this.prismaService.workspace.update({
          where: { id: deleteWorkspaceInput.id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
      }

      return true;
    } catch (error) {
      throw new CreateAppError({
        message: 'Unable to Delete Workspace',
        httpStatus: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }
}
