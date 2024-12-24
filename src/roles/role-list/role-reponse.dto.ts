import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RoleResponse {
  @Field() title: string;
  @Field() type: string;
  @Field() id: string;
  @Field({ nullable: true }) description: string;
  @Field() createdAt: Date;
  @Field() updatedAt: Date;
  @Field({ nullable: true }) deletedAt: Date;
}