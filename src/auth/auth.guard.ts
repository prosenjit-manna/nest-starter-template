import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import appEnv from 'src/env';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request;

    
    const token = this.extractTokenFromHeader(request);


    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: appEnv.JSON_TOKEN_SECRET });
      request.jwt = payload;

      const user = await this.prismaService.user.findFirst({
        where: {
          id: payload.userId
        },
      });
      request.user = user;

    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
