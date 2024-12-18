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
  async verifyOtp(
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
      throw new Error('Invalid email or OTP');
    }

    if (!user.isVerified) {
      throw new Error('Account not verified');
    }

    // time difference in minutes between the current time and the user's last login attempt time.
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

    if (user.twoFactorOtp !== otpLoginInput.otp) {
      await this.prisma.user.update({
        where: { email: user.email },
        data: {
          failedLoginCount: user.failedLoginCount + 1,
          loginAttemptTime: new Date(),
        },
      });
      throw new Error('Invalid email or OTP');
    }

    const { token, expiryDate, refreshToken } = await this.tokenService.generateToken(user);

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
        twoFactorOtp: null,
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
