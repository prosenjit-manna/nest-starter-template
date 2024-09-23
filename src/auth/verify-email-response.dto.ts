import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class VerifyEmailResponse {
  @Field() token: string;
  @Field() refreshToken: string;
}