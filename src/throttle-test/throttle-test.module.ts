import { Module } from '@nestjs/common';
import { ThrottleTestGraphqlService } from './throttle-test-graphql.service';
import { ThrottleTestController } from './throttle-test-rest.controller';

@Module({
  providers: [ThrottleTestGraphqlService],
  controllers: [ThrottleTestController],
})
export class ThrottleTestModule {}
