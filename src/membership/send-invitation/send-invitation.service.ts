import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { SendInvitationResponse } from "./send-invitation-response.dto";
import { SetMetadata, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { RoleGuard } from "src/auth/role.guard";
import { PrivilegeGroup, PrivilegeName } from "@prisma/client";
import { SendInvitationInput } from "./send-invitation-input.dto";
import { PrismaService } from "src/prisma.service";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { CreateAppError } from "src/shared/create-error/create-error";

@Resolver()
@UseGuards(JwtAuthGuard)
export class SendInvitationService {

  constructor(
    private prisma: PrismaService
  ) {}

  @Mutation(() => SendInvitationResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.MEMBERSHIP)
  @SetMetadata('privilegeName', PrivilegeName.CREATE)
  @UsePipes(new ValidationPipe())

 async sendInvitation(
    @Args('sendInvitationInput') sendInvitationInput: SendInvitationInput
  ) {

    const workspaceMembership = await this.prisma.workspaceMembership.findFirst({
      where: {
        userId: sendInvitationInput.userId,
        workspaceId: sendInvitationInput.workspaceId
      }
    });

    if (workspaceMembership) {
      throw new CreateAppError({ message: 'User already a member of this workspace' });
    }

    await this.prisma.workspaceMembership.create({
      data: {
        userId: sendInvitationInput.userId,
        workspaceId: sendInvitationInput.workspaceId
      }
    });

    return {
      success: true
    }
  }
}