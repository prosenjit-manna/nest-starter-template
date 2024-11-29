import { Module } from '@nestjs/common';
import { RoleListService } from './role-list/role-list.service';
import { RoleCreateService } from './role-create/role-create.service';
import { ListPrivilegeService } from './list-base-privilege/list-privilege.service';
import { RoleUpdateService } from './role-update/role-update.service';
import { RoleDeleteService } from './role-delete/role-delete.service';
import { RoleGetService } from './get-role/role-get.service';
import { AssignRoleService } from './assign-role/assign-role.service';
import { UnAssignRoleService } from './unassign-role/unassign-role.service';

@Module({
  providers: [
    RoleListService,
    RoleCreateService,
    RoleUpdateService,
    ListPrivilegeService,
    RoleDeleteService,
    RoleGetService,
    AssignRoleService,
    UnAssignRoleService
  ],
})
export class RoleModule {}
