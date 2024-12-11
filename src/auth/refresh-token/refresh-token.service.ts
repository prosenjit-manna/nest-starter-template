import { Injectable } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from '../token.service';
import { VerifyEmailResponse } from '../verify-email/verify-email-response.dto';
import { RefreshAccessTokenInput } from '../refresh-access-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(
    private prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

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
