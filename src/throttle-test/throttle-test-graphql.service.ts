import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import appEnv from 'src/env';

@Resolver()
export class ThrottleTestGraphqlService {
  @Query(() => String)
  rateLimitGlobal(): string {
    return `has rate limit per  ${(appEnv.THROTTLE_TTL/ 1000/ 60)} min ${appEnv.THROTTLE_LIMIT}`;
  }

  @SkipThrottle()
  @Mutation(() => String)
  rateLimitSkip(): string {
    return `has no rate limit`;
  }
  
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @Mutation(() => String)
  rateLimitCustomize(): string {
    return `has rate limit per ${appEnv.THROTTLE_TTL/ 1000 / 60}  min 2`;
  }
}
