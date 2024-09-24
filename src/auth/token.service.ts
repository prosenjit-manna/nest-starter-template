
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import appEnv from 'src/env';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  public async generateToken(user: User) {
    const token = await this.jwtService.signAsync(
      { userId: user.id },
      { secret: appEnv.JSON_TOKEN_SECRET, expiresIn: appEnv.ACCESS_TOKEN_EXPIRY },
    );

    const refreshToken = await bcrypt.hash(randomBytes(5), 10);
    const expiryDate = addDays(new Date(), 7).toISOString();

    return { token, refreshToken, expiryDate };
  }
}
