import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserResponse {
  @Field() email: string;
  @Field() name: string;
  @Field() id: number;
  
}