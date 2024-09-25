import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TokenService } from '../token.service';
import { Args, Mutation } from '@nestjs/graphql';
import { VerifyEmailResponse } from './verify-email-response.dto';
import { VerifyEmailInput } from './verify-email-input.dto';

@Injectable()
export class VerifyEmailService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
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
}
