

import { Field, ObjectType } from "@nestjs/graphql";
import { BaseListResponse } from "src/shared/base-list/base-list-response.dto";
import { FileResponse } from "./file-response.dto";
import { File } from "@prisma/client";

@ObjectType()
export class ListMediaResponse {
  @Field(() => [FileResponse]) file: File[];
  @Field(() => BaseListResponse) pagination: BaseListResponse;
}