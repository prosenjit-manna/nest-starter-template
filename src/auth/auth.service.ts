import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { LoginResponse } from './login-response.dto';
import { LoginInput } from './login-input.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import appEnv from 'src/env';
import { SignupResponse } from './singup-response.dto';
import { SignupInput } from './signup-input.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { VerifyRegisterEmailContent } from './verify-register-email-content.interface';
import { VerifyEmailInput } from './verify-email-input.dto';
import { VerifyEmailResponse } from './verify-email-response.dto';
import { User } from '@prisma/client';
import { RefreshAccessTokenInput } from './refresh-access-token.dto';

@Resolver()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  private async generateToken(user: User) {
    const token = await this.jwtService.signAsync(
      { userId: user.id },
      { secret: appEnv.JSON_TOKEN_SECRET },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId: user.id },
      {
        secret: appEnv.JSON_TOKEN_SECRET,
      },
    );

    return { token, refreshToken };
  }

  @Query(() => LoginResponse)
  async login(
    @Args('loginInput')
    loginInput: LoginInput,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginInput.email,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      String(user?.password),
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = await this.generateToken(user);

    return {
      id: user?.id,
      token: token,
    };
  }

  @Mutation(() => SignupResponse)
  async signup(
    @Args('signupInput')
    singUpInput: SignupInput,
  ) {
    const hashedPassword = await bcrypt.hash(singUpInput.password, 10);
    const verifyToken = await bcrypt.hash(randomBytes(5), 10);
    const verifyEmailContent: VerifyRegisterEmailContent = {
      verifyURl: `${appEnv.FRONTEND_URL}${appEnv.SIGNUP_VERIFY_URL}${verifyToken}`,
    };
    this.mailerService.sendMail({
      to: singUpInput.email,
      subject: 'Welcome',
      templateName: 'welcome',
      context: verifyEmailContent,
    });

    const result = await this.prisma.user.findFirst({
      where: { email: singUpInput.email },
    });

    if (result) {
      throw new Error('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email: singUpInput.email,
        password: hashedPassword,
        verificationToken: verifyToken,
      },
    });

    return { id: user.id };
  }

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

    const { token, refreshToken } =
      await this.generateToken(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: refreshToken,
      },
    });

    return { token: token, refreshToken: refreshToken };
  }

  @Mutation(() => VerifyEmailResponse)
  async refreshAccessToken(
    @Args('refreshAccessTokenInput')
    refreshAccessToken: RefreshAccessTokenInput,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        refreshToken: refreshAccessToken.refreshToken,
      },
    });

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(
      refreshAccessToken.refreshToken,
      String(user?.refreshToken),
    );

    if (!isValid) {
      throw new Error('Invalid refresh token');
    }

    const { token, refreshToken } = await this.generateToken(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: refreshToken,
      },
    });

    return { token: token, refreshToken: refreshToken };
  }
}
