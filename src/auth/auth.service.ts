import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { VerifyEmailInput } from './verify-email-input.dto';
import { VerifyEmailResponse } from './verify-email-response.dto';
import { User } from '@prisma/client';
import { RefreshAccessTokenInput } from './refresh-access-token.dto';
import { TokenService } from './token.service';

@Resolver()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  @Mutation(() => VerifyEmailResponse)
  async verifyEmail(
    @Args('verifyEmailInput')
    verifyEmailInput: VerifyEmailInput,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: verifyEmailInput.token,
      },
    });

    if (!user) {
      throw new Error('Invalid token');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verificationToken: null,
        isVerified: true,
      },
    });

    const { token, refreshToken, expiryDate } =
      await this.tokenService.generateToken(user);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenExpiry: expiryDate,
      },
    });

    return { token: token, refreshToken: refreshToken };
  }

  @Mutation(() => VerifyEmailResponse)
  async refreshAccessToken(
    @Args('refreshAccessTokenInput')
    refreshAccessToken: RefreshAccessTokenInput,
  ) {
    const session = await this.prisma.session.findFirst({
      where: {
        refreshToken: refreshAccessToken.refreshToken,
      },
    });

    if (!session) {
      throw new Error('Session Invalid');
    }

    if (
      !session ||
      (session.refreshTokenExpiry && new Date() > session.refreshTokenExpiry)
    ) {
      throw new Error('Session Token Expired');
    }

    const user = (await this.prisma.user.findFirst({
      where: {
        id: session.userId,
      },
    })) as unknown as User;

    const { token, refreshToken, expiryDate } =
      await this.tokenService.generateToken(user);

    await this.prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        refreshToken: refreshToken,
        refreshTokenExpiry: expiryDate,
      },
    });

    return { token: token, refreshToken: refreshToken };
  }
}
