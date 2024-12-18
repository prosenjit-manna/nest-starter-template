import { Request } from 'express';
import { LoginResponse } from './login-response.dto';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { LoginInput } from './login-input.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from '../token.service';
import * as bcrypt from 'bcrypt';
import appEnv from 'src/env';
import { codeGenerator } from 'src/shared/helper/codeGenerator';
import { MailerService } from 'src/mailer/mailer.service';
import { CreateAppError } from 'src/shared/create-error/create-error';

@Resolver()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private mailerService: MailerService,
  ) {}

  async updateOtp(email: string): Promise<number> {
    try {
      const otp = codeGenerator(6);
      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          twoFactorOtp: otp,
        },
      });
      return otp;
    } catch (error) {
      throw new Error('Failed to Send OTP');
    }
  }

  @Query(() => LoginResponse)
  async login(
    @Context('req') req: Request,
    @Args('loginInput')
    loginInput: LoginInput,
  ) {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    loginInput.email = loginInput.email.toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: {
        email: loginInput.email,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
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

    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      String(user?.password),
    );

    if (!isPasswordValid) {
      await this.prisma.user.update({
        where: { email: user.email },
        data: {
          failedLoginCount: user.failedLoginCount + 1,
          loginAttemptTime: new Date(),
        },
      });
      throw new Error('Invalid email or password');
    }

    if (appEnv.OTP_FEATURE === true) {
      try {
        const otp = await this.updateOtp(user.email);
        await this.mailerService.sendMail({
          to: loginInput.email,
          subject: 'OTP Verification',
          templateName: 'otp-verification',
          context: {
            name: user.name,
            otp,
          },
        });
        return {
          message: 'OTP sent successfully',
          twoFA: true,
          id: user?.id,
          token: null,
          refreshToken: null,
        };
      } catch (error) {
       throw new CreateAppError({ message: error.message });
      }
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
      twoFA: false,
    };
  }
}
