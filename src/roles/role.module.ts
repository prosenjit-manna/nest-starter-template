import { Module } from '@nestjs/common';
import { RoleListService } from './role-list/role-list.service';
import { PrismaService } from 'src/prisma.service';
import { RoleCreateService } from './role-create/role-create.service';
import { ListPrivilegeService } from './list-base-privilege/list-privilege.service';
import { RoleUpdateService } from './role-update/role-update.service';
import { RoleDeleteService } from './role-delete/role-delete.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    RoleListService,
    RoleCreateService,
    RoleUpdateService,
    ListPrivilegeService,
    RoleDeleteService,
    PrismaService,
  ],
})
export class RoleModule {}
