import { Controller, Get } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import appEnv from 'src/env';

@Controller('rate-limit')
export class ThrottleTestController {

  @Get('public')
  getPublic() {
    return `has rate limit per  ${appEnv.THROTTLE_TTL/ 1000 / 60} min ${appEnv.THROTTLE_LIMIT}`;
  }

  @SkipThrottle()
  @Get('skip')
  getSkip() {
    return 'This request has no rate limit';
  }

  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @Get('custom')
  getCustom() {
    return `has rate limit per ${appEnv.THROTTLE_TTL/ 1000 / 60}  min 2`;
  }
}
