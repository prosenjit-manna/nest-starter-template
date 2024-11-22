import { HttpStatus } from "@nestjs/common";
import { WorkspaceMembership } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { CreateAppError } from "src/shared/create-error/create-error";

export class PostMemberShipValidation {
 
  async validateMembership(prisma: PrismaService, userId: string, workSpaceId: string) {
    console.log(userId, workSpaceId);

    const membership = await prisma.workspaceMembership.findMany({
      where: {
        userId: userId,
        isAccepted: true,
      },
    });
  
    if (!membership.some((m) => m.workspaceId === workSpaceId)) {
      throw new CreateAppError({ message: 'Membership not available for this workspace', httpStatus: HttpStatus.FORBIDDEN });
    }

    return membership
  }

  validateAuthorMembership(memberships: WorkspaceMembership[], authorId: string) {
    if (!memberships.some((m) => m.userId === authorId)) {
      throw new CreateAppError({ message: 'Membership not available for this author', httpStatus: HttpStatus.FORBIDDEN });
    }
  }
}