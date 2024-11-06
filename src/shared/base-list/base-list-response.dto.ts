import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BaseListResponse {
  @Field() totalPage: number;
  @Field() currentPage: number;
  @Field() perPage: number;
}