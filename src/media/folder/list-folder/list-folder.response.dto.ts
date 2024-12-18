import { Field, ObjectType } from "@nestjs/graphql";
import { BaseListResponse } from "src/shared/base-list/base-list-response.dto";
import { Folder } from "@prisma/client";
import { FolderResponse } from "./folder-response.dto";

@ObjectType()
export class FolderListResponse {
  @Field(() => [FolderResponse]) folder: Folder[];
  @Field(() => BaseListResponse) pagination: BaseListResponse;
}