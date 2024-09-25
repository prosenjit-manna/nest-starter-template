import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UpdatePostResponse {
  @Field() id: string;
}