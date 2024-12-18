import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Request } from "express";

import { PrismaService } from "src/prisma/prisma.service";
import { CreateFolderInput } from "./create-folder.input.dto";
import { CreateFolderResponse } from "./create-folder.response.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Resolver()
@UseGuards(JwtAuthGuard)
export class CreateFolderService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  @Mutation(() => CreateFolderResponse) 
  async createFolder(
    @Context('req') req: Request,
    @Args('createFolderInput', { nullable: true }) createFolderInput: CreateFolderInput,
  ) {
    const folder = await this.prismaService.folder.create({
      data: {
        ...createFolderInput,
        authorId: req.user?.id || '',
        workspaceId: req.currentWorkspaceId,
      },
    });

    return folder
  }
}