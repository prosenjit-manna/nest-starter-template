import { Args, Mutation, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { SetMetadata, UseGuards } from '@nestjs/common';

import { SendInvitationResponse } from './send-invitation-response.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { SendInvitationInput } from './send-invitation-input.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { randomBytes } from 'crypto';
import { MailerService } from 'src/mailer/mailer.service';
import appEnv from 'src/env';

@Resolver()
@UseGuards(JwtAuthGuard)
export class SendInvitationService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  @Mutation(() => SendInvitationResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.MEMBERSHIP)
  @SetMetadata('privilegeName', PrivilegeName.CREATE)
  async sendInvitation(
    @Args('sendInvitationInput') sendInvitationInput: SendInvitationInput,
  ) {
    const workspaceMembership = await this.prisma.workspaceMembership.findFirst(
      {
        where: {
          userId: sendInvitationInput.userId,
          workspaceId: sendInvitationInput.workspaceId,
        },
      },
    );

    if (workspaceMembership) {
      throw new CreateAppError({
        message: 'User already a member of this workspace',
      });
    }

    const verifyToken = await bcrypt.hash(randomBytes(5), 10);

    await this.prisma.workspaceMembership.create({
      data: {
        userId: sendInvitationInput.userId,
        workspaceId: sendInvitationInput.workspaceId,
        invitationToken: verifyToken,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: sendInvitationInput.userId,
      },
    });

    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: sendInvitationInput.workspaceId,
      },
    });

    await this.mailerService.sendMail({
      to: user?.email || '',
      subject: 'Membership Invitation',
      templateName: 'membership',
      context: {
        workspace: workspace?.name,
        verifyURl: `${appEnv.FRONTEND_URL}${appEnv.FRONTEND_URL}${appEnv.MEMBERSHIP_VERIFY_URL}${verifyToken}`,
      },
    });

    return {
      success: true,
    };
  }
}
