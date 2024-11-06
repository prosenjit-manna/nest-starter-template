import { Field, ObjectType } from "@nestjs/graphql";
import { BaseListResponse } from "src/shared/base-list/base-list-response.dto";
import { PostResponse } from "../post-response.dto";
import { Post } from "@prisma/client";

@ObjectType()
export class PostListResponse {
  @Field(() => [PostResponse])
  posts: Post[];

  @Field(() => BaseListResponse)
  pagination: BaseListResponse;

}