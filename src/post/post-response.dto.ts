import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PostAuthor {
  @Field() id: string;
  @Field() name: string;
}
@ObjectType()
export class PostResponse {
  @Field() title: string;
  @Field() content: string;
  @Field() id: string;
  @Field() published: boolean;
  @Field(() => PostAuthor) author: PostAuthor;

  @Field() createdAt: Date;
  @Field() updatedAt: Date;
  @Field({ nullable: true }) deletedAt: Date;
}

