import { Module } from '@nestjs/common';
import { RoleListService } from './role-list/role-list.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RoleListService, PrismaService],
})
export class RoleModule {}
