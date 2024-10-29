import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { PasswordResetService } from './password-reset/password-reset.service';
import appEnv from 'src/env';
import { MailerModule } from 'src/mailer/mailer.module';
import { LoginService } from './login/login.service';
import { SignupService } from './signup/signup.service';
import { VerifyEmailService } from './verify-email/verify-email.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: appEnv.JSON_TOKEN_SECRET,
    }),
    MailerModule,
  ],
  providers: [
    JwtService,
    PasswordResetService,
    TokenService,
    LoginService,
    SignupService,
    VerifyEmailService,
    RefreshTokenService,
  ],
})
export class AuthModule {}
