import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RoleUpdateResponse {
  @Field() id: string;
}