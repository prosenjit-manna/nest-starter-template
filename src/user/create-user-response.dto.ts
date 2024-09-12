

import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CreateUserResponse {
  @Field() id: number;
}