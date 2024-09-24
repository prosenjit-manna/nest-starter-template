import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PostResponse {
  @Field() title: string;
  @Field() content: string;
  @Field() id: number;
  @Field() published: boolean;
  @Field() authorId: number;
}