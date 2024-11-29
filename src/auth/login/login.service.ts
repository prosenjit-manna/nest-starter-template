import { Request } from 'express';
import { LoginResponse } from './login-response.dto';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { LoginInput } from './login-input.dto';
import { PrismaService } from 'src/prisma.service';
import { TokenService } from '../token.service';
import * as bcrypt from 'bcrypt';

@Resolver()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

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

    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      String(user?.password),
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
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

    return {
      id: user?.id,
      token,
      refreshToken,
    };
  }
}
