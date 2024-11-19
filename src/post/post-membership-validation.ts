import { WorkspaceMembership } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

export class PostMemberShipValidation {
  constructor(private prisma: PrismaService) {}
 
  async validateMembership(userId: string, workSpaceId: string) {
    const membership = await this.prisma.workspaceMembership.findMany({
      where: {
        userId: userId,
        isAccepted: true,
      },
    });
  
    if (!membership.some((m) => m.workspaceId === workSpaceId)) {
      throw new Error('Membership not available for this workspace');
    }

    return membership
  }

  validateAuthorMembership(memberships: WorkspaceMembership[], authorId: string) {
    if (!memberships.some((m) => m.userId === authorId)) {
      throw new Error('Membership not available for this author');
    }
  }
}