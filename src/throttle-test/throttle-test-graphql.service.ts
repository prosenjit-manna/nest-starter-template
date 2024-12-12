import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
// import { Throttle } from 'src/throttle/throttle.decorator';

@Resolver()
export class ThrottleTestGraphqlService {
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @Mutation(() => String)
  throttleTest(): string {
    return 'This is throttled!';
  }
}
