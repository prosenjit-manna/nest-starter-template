import { Module } from '@nestjs/common';
import { RoleListService } from './role-list/role-list.service';
import { PrismaService } from 'src/prisma.service';
import { RoleCreateService } from './role-create/role-create.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RoleListService, RoleCreateService, PrismaService],
})
export class RoleModule {}
