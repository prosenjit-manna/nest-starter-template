import { Module } from "@nestjs/common";

import { CreateWorkspaceService } from "./create-workspace/create-workspace.service";
import { ListWorkSpaceService } from "./list-workspace/list-workspace.service";
import { UpdateWorkspaceService } from "./update-workspace/update-workspace.service";
import { DeleteWorkSpaceService } from "./delete-workspace/delete-workspace.service";
import { MembershipModule } from './membership/membership.module';
import { RestoreWorkSpaceService } from "./restore-workspace/delete-workspace.service";

@Module({
  providers: [
    CreateWorkspaceService,
    UpdateWorkspaceService,
    ListWorkSpaceService,
    DeleteWorkSpaceService,
    RestoreWorkSpaceService,
  ],
  imports: [
    MembershipModule
  ]
})
export class WorkspaceModule {}
