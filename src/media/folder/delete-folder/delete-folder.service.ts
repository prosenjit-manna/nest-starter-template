import { HttpStatus, SetMetadata, UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { PrivilegeGroup, PrivilegeName } from "@prisma/client";
import { MemberShipValidationType } from "src/auth/membership-validation-type.enum";
import { RoleGuard } from "src/auth/role.guard";
import { WorkspaceMemberShipGuard } from "src/auth/workspace-membership.guard";
import { DeleteFolderInput } from "./delete-folder.input.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAppError } from "src/shared/create-error/create-error";

@Resolver()
export class DeleteFolderService {

    constructor(
      private prismaService: PrismaService,
    ) {}

  @Mutation(() => Boolean)
    @UseGuards(RoleGuard)
    @SetMetadata('privilegeGroup', PrivilegeGroup.MEDIA)
    @SetMetadata('privilegeName', PrivilegeName.DELETE)
  
    @UseGuards(WorkspaceMemberShipGuard)
    @SetMetadata('memberShipValidationType', MemberShipValidationType.MEMBERSHIP_VALIDITY)
  
    async deleteFolder(
      @Context('req') req: Request,
      @Args('folderDeleteInput', { nullable: true })
      folderDeleteInput: DeleteFolderInput,
    ): Promise<boolean> {
  
      const post = await this.prismaService.folder.findUnique({
        where: { id: folderDeleteInput.id, deletedAt: folderDeleteInput.fromStash ? { not: null } : null },
      });
  
  
      if (!post) {
        throw new CreateAppError({
          message: 'Folder not found',
          httpStatus: HttpStatus.NOT_FOUND,
        });
      }
  
      try {
        if (folderDeleteInput.fromStash) {
          await this.prismaService.folder.delete({ where: { id: folderDeleteInput.id } });
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