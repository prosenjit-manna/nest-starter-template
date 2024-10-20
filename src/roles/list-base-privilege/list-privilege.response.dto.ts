import { Field, ObjectType } from "@nestjs/graphql";
import { Privilege } from "@prisma/client";
import { PrivilegeResponse } from "./privilege-response.dto";

@ObjectType()
export class PrivilegeListResponse {
  @Field(() => [PrivilegeResponse])
  privilege: Privilege[];
}