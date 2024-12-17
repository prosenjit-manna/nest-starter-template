import { Args, Query, Resolver } from "@nestjs/graphql";
import { GetFolderResponse } from "./get-folder-response.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GetFolderInput } from "./get-folder.input.dto";

@Resolver()
export class GetFolderService {
  constructor(private prisma: PrismaService) {}
  

  @Query(() => GetFolderResponse)
  async getFolder(
    @Args('getFolderInput') getFolderInput: GetFolderInput,
  ) {

    return await this.prisma.folder.findUnique({
      where: {
        id: getFolderInput.id,
      }
    });
  }
}