import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GetPostResponse {
  @Field() id: string;
  @Field() title: string;
  @Field({ nullable: true }) content?: string;
  @Field({ nullable: true }) published?: boolean;
  @Field({ nullable: true }) authorId?: string;
  @Field() createdAt: Date;
  @Field() updatedAt: Date;
  @Field({ nullable: true }) deletedAt?: Date;
}