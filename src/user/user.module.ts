import { GetUserService } from './get-user/get-users.service';
import { UserService } from './user.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [UserService, GetUserService],
})
export class UserModule {}
