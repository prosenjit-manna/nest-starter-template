import { Field, ObjectType } from "@nestjs/graphql";
import { baseListResponse } from "src/shared/base-list/base-list-response.dto";
import { Workspace } from "@prisma/client";
import { WorkSpaceResponse } from "./workspace-response.dto";

@ObjectType()
export class ListWorkSpaceResponse {
  @Field(() => [WorkSpaceResponse])
  workspace: Workspace[];

  @Field(() => baseListResponse)
  pagination: baseListResponse;

}