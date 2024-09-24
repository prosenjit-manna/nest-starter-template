import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RoleResponse {
  @Field() title: string;
  @Field() name: string;
  @Field() id: string;
}