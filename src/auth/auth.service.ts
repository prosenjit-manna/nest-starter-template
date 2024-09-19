import { Args, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { LoginResponse } from './login-response.dto';
import { LoginInput } from './login-input.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import appEnv from 'src/env';

@Resolver()
export class AuthService {
  constructor(private prisma: PrismaService, private readonly jwtService: JwtService,) {}

  @Query(() => LoginResponse)
  async login(
    @Args('loginInput')
    loginInput: LoginInput,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginInput.email,
      }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginInput.password, String(user?.password));


    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = await this.jwtService.signAsync({ userId: user.id }, { secret:appEnv.JSON_TOKEN_SECRET });

    return {
      id: user?.id,
      token: token,
    }
  }
}
