import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma.service';
import appEnv from 'src/env';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { PasswordResetRequestInput } from './password-reset-request-input.dto';
import { PassWordResetRequestResponse } from './password-reset-request-response.dto';
import { PasswordResetInput } from './password-reset-input.dto';
import { PassWordResetResponse } from './password-reset-response.dto';
import { TokenService } from '../token.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

@Resolver()
export class PasswordResetService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private tokenService: TokenService,
  ) {}

  @Mutation(() => PassWordResetRequestResponse)
  async requestPasswordReset(
    @Args('passwordReset') passwordReset: PasswordResetRequestInput,
  ) {
    let user: User | null = null;

    // check if user exists
    try {
       user = await this.prisma.user.findFirst({
        where: { email: passwordReset.email.toLowerCase(), },
      });
    } catch (error) {
      return { message: 'Password reset email sent' };
    }
    

    if (!user) {
      return { message: 'Password reset email sent' };
    }

    // generate json web token
    const { token } = await this.tokenService.generateToken(user);

    this.mailerService.sendMail({
      to: passwordReset.email,
      subject: 'Password Reset Request',
      templateName: 'password-reset-request',
      context: {
        name: user.name,
        passwordResetUrl: `${appEnv.FRONTEND_URL}${appEnv.PASSWORD_RESET_URL}?token=${token}`,
      },
    });

    // update user with password reset token
    await this.prisma.user.update({
      where: { email: passwordReset.email.toLowerCase() },
      data: { passwordResetToken: token },
    });

    // Send email to user with reset link
    return { message: 'Password reset email sent' };
  }

  @Mutation(() => PassWordResetResponse)
  @UseGuards(JwtAuthGuard)
  async resetPassword(
    @Args('resetPassword') resetPassword: PasswordResetInput,
    @Context('req') req: Request,
  ): Promise<PassWordResetResponse> {

    const user = req.user;

    if (!user?.passwordResetToken) {
      throw new Error('Token Expired');
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(resetPassword.password, 10);



    // update user with new password
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, passwordResetToken: null },
    });

    return { message: 'Password reset successful',  };
  }
}
