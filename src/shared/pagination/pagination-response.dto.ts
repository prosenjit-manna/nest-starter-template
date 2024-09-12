import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PaginationResponse {
  @Field() totalPage: number;
  @Field() currentPage: number;
  @Field() perPage: number;
}