import { Request } from 'express';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from '../token.service';
import appEnv from 'src/env';
import { LoginResponse } from '../login/login-response.dto';
import { OtpLoginInput } from './otp-login-input.dto';

@Resolver()
export class OtpLoginService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  @Mutation(() => LoginResponse)
  async otpLogin(
    @Context('req') req: Request,
    @Args('otpLoginInput')
    otpLoginInput: OtpLoginInput,
  ) {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    otpLoginInput.email = otpLoginInput.email.toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: {
        email: otpLoginInput.email,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new Error('Account not verified');
    }

    const timeDifference = Math.round(
      (new Date().getTime() - new Date(user.loginAttemptTime || '').getTime()) /
        (1000 * 60),
    );

    const accountLock = timeDifference <= appEnv.ACCOUNT_LOCK_TIME;

    if (user.failedLoginCount >= appEnv.ACCOUNT_LOCK_ATTEMPT && accountLock) {
      throw new Error(
        `Maximum retry count reached. Please try after ${appEnv.ACCOUNT_LOCK_TIME - timeDifference ? appEnv.ACCOUNT_LOCK_TIME - timeDifference : 1} minutes!`,
      );
    }

    if (user.code !== otpLoginInput.otp) {
      await this.prisma.user.update({
        where: { email: user.email },
        data: {
          failedLoginCount: user.failedLoginCount + 1,
          loginAttemptTime: new Date(),
        },
      });
      throw new Error('Invalid otp');
    }

    const { token, expiryDate, refreshToken } =
      await this.tokenService.generateToken(user);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: refreshToken,
        refreshTokenExpiry: expiryDate,
        ipAddress: ip?.toString(),
      },
    });

    // Clear expired sessions
    // For improve performance
    await this.prisma.session.deleteMany({
      where: {
        refreshTokenExpiry: {
          lt: new Date(),
        },
      },
    });

    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        failedLoginCount: 0,
        loginAttemptTime: new Date(),
        code: null,
      },
    });

    return {
      id: user?.id,
      token,
      refreshToken,
      twoFA: true,
    };
  }
}
