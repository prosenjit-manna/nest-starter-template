import { Module } from "@nestjs/common";
import { CreateWorkspaceService } from "./create-workspace/create-workspace.service";

@Module({
  providers: [
    CreateWorkspaceService
  ]
})
export class WorkspaceModule {}
