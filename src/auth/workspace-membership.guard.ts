import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { WorkspaceMembership } from "@prisma/client";
import { Request } from "express";

import { PrismaService } from "src/prisma.service";
import { MemberShipValidationType } from "./membership-validation-type.enum";
import { CreateAppError } from "src/shared/create-error/create-error";

@Injectable()
export class WorkspaceMemberShipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve roles metadata set by `@SetMetadata`
    const validationType = this.reflector.get<MemberShipValidationType>('memberShipValidationType', context.getHandler());

    const ctx = GqlExecutionContext.create(context);

    // Retrieve user from request object
    const request = ctx.getContext().req as Request;

    const user = request.user;
    const memberships = await this.getMemberShips(user?.id || '');
    request.memberships = memberships;


    if (user && validationType === MemberShipValidationType.AUTHOR_VALIDITY && request.currentWorkspaceId) {
      return this.validateAuthorMembership(memberships, user.id);
    } else if (user && validationType === MemberShipValidationType.MEMBERSHIP_VALIDITY && request.currentWorkspaceId) { 
      return this.validateMembership(memberships, request.currentWorkspaceId);
    } else {
      // Block All other exceptions 
      return false;
    }
  }

  async getMemberShips(userId: string) {
    return await this.prisma.workspaceMembership.findMany({
      where: {
        isAccepted: true,
        userId,
      },
    });
  }

  async validateMembership(memberships: WorkspaceMembership[], workSpaceId: string) {
    if (!memberships.some((m) => m.workspaceId === workSpaceId)) {
      throw new CreateAppError({ message: 'Membership not available for this workspace', httpStatus: HttpStatus.FORBIDDEN });
    }

    return true;
  }

  validateAuthorMembership(memberships: WorkspaceMembership[], authorId: string) {
    if (!memberships.some((m) => m.userId === authorId)) {
      throw new Error('Membership not available for this author');
    }
    return true;
  }

}