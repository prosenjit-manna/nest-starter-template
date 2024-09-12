import { Field, ObjectType } from "@nestjs/graphql";
import { UserResponse } from "src/user/user.response.dto";

@ObjectType()
export class PostResponse {
  @Field() title: string;
  @Field() content: string;
  @Field() id: number;
  @Field() published: boolean;
  @Field() authorId: number;
  @Field() author: UserResponse;
}