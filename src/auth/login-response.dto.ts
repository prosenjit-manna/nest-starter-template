import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LoginResponse {
  @Field() id: number;
  @Field() token: string;
}