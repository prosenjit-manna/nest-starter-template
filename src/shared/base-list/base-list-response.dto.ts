import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class baseListResponse {
  @Field() totalPage: number;
  @Field() currentPage: number;
  @Field() perPage: number;
}