import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationResponse } from "src/shared/pagination/pagination-response.dto";
import { PostResponse } from "./post-response.dto";
import { Post } from "@prisma/client";

@ObjectType()
export class PostListResponse {
  @Field(() => [PostResponse])
  posts: Post[];

  @Field(() => PaginationResponse)
  pagination: PaginationResponse;

}