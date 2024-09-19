import { PrismaService } from 'src/prisma.service';
import { UserService } from './user.service';

import { Module } from '@nestjs/common';
import { RoleService } from './role.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UserService, RoleService, PrismaService],
})
export class UserModule {}
