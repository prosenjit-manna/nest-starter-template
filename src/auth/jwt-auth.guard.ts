import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { appConfig } from 'src/app.config';
import appEnv from 'src/env';
import { PrismaService } from 'src/prisma.service';
import { CreateAppError, CustomApolloServerErrorCode } from 'src/shared/create-error/create-error';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const token = this.extractTokenFromHeader(request);
    const currentWorkspaceId = request.headers[appConfig.current_workspace_id] as string;

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
      request.currentWorkspaceId = currentWorkspaceId;

    } catch (err) {
      console.log(err)
      if (err.name === "TokenExpiredError") {
        throw new CreateAppError({ message: "Token expired", httpStatus: CustomApolloServerErrorCode.TOKEN_EXPIRED });
      }
      throw new UnauthorizedException(err.message);
    }

    return true;
  }

  private getRequest(context: ExecutionContext): Request {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    } else if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    }
    throw new UnauthorizedException('Invalid context type');
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}