import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LoginResponse {
  @Field() id: string;
  @Field() token: string;
}