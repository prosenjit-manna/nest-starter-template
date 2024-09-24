import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RoleCreateResponse {
  @Field() id: string;
}