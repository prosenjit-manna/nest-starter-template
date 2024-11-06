import { Field, ObjectType } from "@nestjs/graphql";
import { BaseListResponse } from "src/shared/base-list/base-list-response.dto";
import { Workspace } from "@prisma/client";
import { WorkSpaceResponse } from "./workspace-response.dto";

@ObjectType()
export class ListWorkSpaceResponse {
  @Field(() => [WorkSpaceResponse])
  workspace: Workspace[];

  @Field(() => BaseListResponse)
  pagination: BaseListResponse;

}