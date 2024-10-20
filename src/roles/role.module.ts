import { Module } from '@nestjs/common';
import { RoleListService } from './role-list/role-list.service';
import { PrismaService } from 'src/prisma.service';
import { RoleCreateService } from './role-create/role-create.service';
import { ListPrivilegeService } from './list-base-privilege/list-privilege.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RoleListService, RoleCreateService, ListPrivilegeService, PrismaService],
})
export class RoleModule {}
