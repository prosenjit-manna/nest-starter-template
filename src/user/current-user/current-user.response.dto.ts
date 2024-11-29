import { Field, ObjectType } from "@nestjs/graphql";
import { UserType } from "@prisma/client";
import { RolePrivilegeResponse } from "src/roles/get-role/role-get-response.dto";

@ObjectType()
export class CurrentUserResponse {
  @Field(() => String) 
  email: string;

  @Field(() => String, { nullable: true }) 
  name: string | null;

  @Field(() => String) 
  id: string;

  @Field(() => String) 
  userType: UserType;

  @Field(() => Number) 
  sessionCount: number;

  @Field(() => [String]) 
  roles: string[];

  @Field(() => [RolePrivilegeResponse])
  privilege: RolePrivilegeResponse[];

}