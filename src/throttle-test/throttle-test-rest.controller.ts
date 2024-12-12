import { Controller, Get, Post } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('throttle')
export class ThrottleTestController {
  @Get('public')
  getPublic() {
    return 'This is public and not throttled!';
  }

  @SkipThrottle()
  @Get('throttled')
  getThrottled() {
    return 'This is a throttled GET request!';
  }

  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @Post('throttled')
  postThrottled() {
    return 'This is a throttled POST request!';
  }
}
