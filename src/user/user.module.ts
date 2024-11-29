import { CurrentUserService } from './current-user/current-user.service';
import { GetUserService } from './get-user/get-users.service';

import { Module } from '@nestjs/common';
import { UpdateProfileService } from './update-profile/update-profile.service';

@Module({
  providers: [GetUserService, CurrentUserService, UpdateProfileService],
})
export class UserModule {}
