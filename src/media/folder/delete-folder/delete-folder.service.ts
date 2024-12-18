import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { DeleteFolderInput } from './delete-folder.input.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver()
export class DeleteFolderService {
  constructor(private prismaService: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteFolder(
    @Context('req') req: Request,
    @Args('folderDeleteInput', { nullable: true }) folderDeleteInput: DeleteFolderInput,
  ): Promise<boolean> {
    const folder = await this.prismaService.folder.findUnique({
      where: {
        id: folderDeleteInput.id,
        deletedAt: folderDeleteInput.fromStash ? { not: null } : null,
        workspaceId: req.currentWorkspaceId,
      },
    });

    if (!folder) {
      throw new CreateAppError({
        message: 'Folder not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    try {
      if (folderDeleteInput.fromStash) {
        await this.prismaService.folder.delete({
          where: { id: folderDeleteInput.id },
        });
      } else {
        await this.prismaService.folder.update({
          where: { id: folderDeleteInput.id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
      }

      return true;
    } catch (error) {
      throw new CreateAppError({
        message: 'Unable to Delete Folder',
        httpStatus: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }
}
