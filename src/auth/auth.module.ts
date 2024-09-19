import {  Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import appEnv from 'src/env';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: appEnv.JSON_TOKEN_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, PrismaService, JwtService],
})
export class AuthModule {}
