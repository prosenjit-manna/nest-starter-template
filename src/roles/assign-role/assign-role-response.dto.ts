import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AssignRoleResponse {
  @Field() success: boolean;
}
