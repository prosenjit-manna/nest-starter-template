import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UpdateProfileResponse {

  @Field()
  success: boolean;
}