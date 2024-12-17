import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { GetFileInput } from './get-file.input';
import { GetFileResponse } from './get-file-response.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class GetFileService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  @Query(() => GetFileResponse, { nullable: true })
  async getFile(
    @Context('req') req: Request,
    @Args('getFileInput', { nullable: true }) getFileInput: GetFileInput,
  ) {
    const file = await this.prismaService.file.findFirst({
      where: {
        workspaceId: req.currentWorkspaceId,
        id: getFileInput.id,
        deletedAt: getFileInput.fromStash ? { not: null } : null,
      },
      include: {
        resizeImages: true,
      }
    });


    if (!file) {
      throw new CreateAppError({
        message: 'File not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    return file;
  }
}
