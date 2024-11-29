import { CurrentUserService } from './current-user/current-user.service';
import { GetUserService } from './get-user/get-users.service';

import { Module } from '@nestjs/common';

@Module({
  providers: [GetUserService, CurrentUserService],
})
export class UserModule {}
