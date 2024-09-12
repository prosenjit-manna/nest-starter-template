import { PrismaService } from 'src/prisma.service';
import { UserService } from './user.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [UserService, PrismaService],
})
export class UserModule {}
