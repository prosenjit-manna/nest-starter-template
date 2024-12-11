import { HttpStatus, UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Request } from "express";

import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAppError } from "src/shared/create-error/create-error";
import { FileDeleteInput } from "./delete-file.input";
import { FileService } from "../upload-file/upload-file.service";

@Resolver()
@UseGuards(JwtAuthGuard)
export class DeleteFileService {
  constructor(
    private prismaService: PrismaService,
    private fileService: FileService,
  ) {}

  @Mutation(() => Boolean)
  async deleteFile(
    @Context('req') req: Request,
    @Args('fileDeleteInput', { nullable: true }) fileDeleteInput: FileDeleteInput,
  ): Promise<boolean> {

    const file = await this.prismaService.file.findUnique({
      where: { id: fileDeleteInput.id, deletedAt: fileDeleteInput.fromStash ? { not: null } : null },
    });


    if (!file) {
      throw new CreateAppError({
        message: 'File not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    try {
      if (fileDeleteInput.fromStash) {
        await this.prismaService.file.delete({ where: { id: fileDeleteInput.id } });
        await this.fileService.deleteFile(file.url);
      } else {
        await this.prismaService.file.update({
          where: { id: fileDeleteInput.id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
      }

      return true;
    } catch (error) {
      throw new CreateAppError({
        message: error.message,
        httpStatus: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }
}