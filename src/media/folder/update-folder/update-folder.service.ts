import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UpdateFolderInput } from "./update-folder.input.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Resolver()
export class UpdateFolderService {
 constructor(
    private prismaService: PrismaService,
  ) {}
  
  @Mutation(() => Boolean)
  async updateFolder(
    @Args('updateFolderInput') updateFolderInput: UpdateFolderInput,
  ): Promise<boolean> {
    await this.prismaService.folder.update({
      where: { id: updateFolderInput.id },
      data: { ...updateFolderInput },
    })

    return true;
  }
}