import { Module } from "@nestjs/common";

import { CreateWorkspaceService } from "./create-workspace/create-workspace.service";
import { ListWorkSpaceService } from "./list-workspace/list-workspace.service";
import { UpdateWorkspaceService } from "./update-workspace/update-workspace.service";
import { DeleteWorkSpaceService } from "./delete-workspace/delete-workspace.service";
import { MembershipModule } from './membership/membership.module';

@Module({
  providers: [
    CreateWorkspaceService,
    UpdateWorkspaceService,
    ListWorkSpaceService,
    DeleteWorkSpaceService,
  ],
  imports: [
    MembershipModule
  ]
})
export class WorkspaceModule {}
