import { Injectable } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma.service';
import { TokenService } from '../token.service';
import { SignupResponse } from './singup-response.dto';
import { SignupInput } from './signup-input.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { VerifyRegisterEmailContent } from '../verify-register-email-content.interface';
import appEnv from 'src/env';

@Injectable()
export class SignupService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}
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
}
