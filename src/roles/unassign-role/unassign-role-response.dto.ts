import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UnAssignRoleResponse {
  @Field() success: boolean;
}
