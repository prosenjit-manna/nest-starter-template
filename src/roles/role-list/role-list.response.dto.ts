import { Field, ObjectType } from "@nestjs/graphql";
import { BaseListResponse } from "src/shared/base-list/base-list-response.dto";
import { RoleResponse } from "./role-reponse.dto";
import { Role } from "@prisma/client";

@ObjectType()
export class RoleListResponse {
  @Field(() => [RoleResponse])
  role: Role[];

  @Field(() => BaseListResponse)
  pagination: BaseListResponse;

}