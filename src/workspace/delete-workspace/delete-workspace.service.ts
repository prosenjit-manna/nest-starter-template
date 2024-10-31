import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { WorkspaceDeleteInput } from './workspace-delete-input.dto';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';

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
  ): Promise<boolean> {
    const post = await this.prismaService.workspace.findUnique({
      where: {
        id: deleteWorkspaceInput.id,
        deletedAt: deleteWorkspaceInput.fromStash ? { not: null } : null,
      },
    });

    if (!post) {
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
