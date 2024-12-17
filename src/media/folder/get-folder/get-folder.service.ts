import { Args, Context, Query, Resolver } from "@nestjs/graphql";
import { Request } from "express";

import { GetFolderResponse } from "./get-folder-response.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GetFolderInput } from "./get-folder.input.dto";

@Resolver()
export class GetFolderService {
  constructor(private prisma: PrismaService) {}
  
  @Query(() => GetFolderResponse)
  async getFolder(
    @Context('req') req: Request,
    @Args('getFolderInput') getFolderInput: GetFolderInput,
  ) {

    const folder =  await this.prisma.folder.findUnique({
      where: {
        id: getFolderInput.id,
        workspaceId: req.currentWorkspaceId,
      },
      include: {
        parent: true,
      }
    });

    const subFolders = await this.prisma.folder.findMany({
      where: {
        parentId: folder?.id,
      },
    });

    return {...folder, subFolders};
  }
}