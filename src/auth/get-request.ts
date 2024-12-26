import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

export function getRequest(context: ExecutionContext): Request {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest();
  } else if (context.getType<GqlContextType>() === 'graphql') {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  throw new UnauthorizedException('Invalid context type');
}
