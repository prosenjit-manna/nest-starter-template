import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { PasswordResetService } from './password-reset/password-reset.service';
import appEnv from 'src/env';
import { MailerModule } from 'src/mailer/mailer.module';
import { LoginService } from './login/login.service';
import { SignupService } from './signup/signup.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: appEnv.JSON_TOKEN_SECRET,
    }),
    MailerModule,
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    PasswordResetService,
    TokenService,
    LoginService,
    SignupService
  ],
})
export class AuthModule {}
