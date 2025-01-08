import { HttpStatus, UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Request } from "express";

import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAppError } from "src/shared/create-error/create-error";
import { ResizeFileInput } from "./resize-file.input";
import { FileService } from "../file.service";
import GraphQLJSON from "graphql-type-json";

@Resolver()
@UseGuards(JwtAuthGuard)
export class ResizeFileService {
  constructor(
    private prismaService: PrismaService,
    private fileService: FileService,
  ) {}

  @Mutation(() => GraphQLJSON)
  async resizeFile(
    @Context('req') req: Request,
    @Args('resizeFileInput', { nullable: true }) resizeFileInput: ResizeFileInput,
  ) {


    const file = await this.prismaService.file.findUnique({
      where: { id: resizeFileInput.id,  },
    });

    if (!file) {
      throw new CreateAppError({
        message: 'File not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }


    const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!imageMimeTypes.includes(file.mimeType)) {
      throw new CreateAppError({
        message: 'Only Images can be resized',
      });
    }

    let filePath = '';

    if (resizeFileInput.resizeOptions.left && resizeFileInput.resizeOptions.top) {
      filePath = await this.fileService.cropImage(file, resizeFileInput.resizeOptions);
    } else {
      filePath = await this.fileService.resizeImage(file, resizeFileInput.resizeOptions);
    }
    

    await this.prismaService.file.deleteMany({
      where: {
        resizeImageId: file.id,
        workspaceId: file.workspaceId,
        url: filePath
      }
    })

    const media = await this.prismaService.file.create({
      data: {
        resizeImageId: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        url: filePath,
        workspaceId: file.workspaceId
      },
    });

    return media;
  }
}