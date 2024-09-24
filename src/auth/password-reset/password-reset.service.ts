import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma.service';
import appEnv from 'src/env';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PasswordResetRequestInput } from './password-reset-request-input.dto';
import { PassWordResetRequestResponse } from './password-reset-request-response.dto';
import { PasswordResetInput } from './password-reset-input.dto';

@Resolver()
export class PasswordResetService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  @Mutation(() => PassWordResetRequestResponse)
  async requestPasswordReset(
    @Args('passwordReset') passwordReset: PasswordResetRequestInput,
  ) {

    // check if user exists
    const user = await this.prisma.user.findFirst({
      where: { email: passwordReset.email },
    });

    if (!user) {
      return { message: 'Password reset email sent - 1' };
    }
    
    // generate token with random bytes
    const passwordResetToken = await bcrypt.hash(randomBytes(5), 10);

    this.mailerService.sendMail({
      to: passwordReset.email,
      subject: 'Password Reset Request',
      templateName: 'password-reset-request',
      context: {
        name: user.name,
        passwordResetUrl: `${appEnv.FRONTEND_URL}${appEnv.PASSWORD_RESET_URL}${passwordResetToken}`,
      },
    });

    // update user with password reset token
    await this.prisma.user.update({
      where: { email: passwordReset.email },
      data: { passwordResetToken },
    });

    // Send email to user with reset link
    return { message: 'Password reset email sent' };
  }

  @Mutation(() => PassWordResetResponse)
  async resetPassword(
    @Args('resetPassword') resetPassword: PasswordResetInput,
  ) {

  }
}
