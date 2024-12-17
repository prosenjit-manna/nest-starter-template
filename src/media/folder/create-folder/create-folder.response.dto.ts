import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CreateFolderResponse {
  @Field(() => String) id: string;
  @Field(() => String) name: string;
  @Field(() => String, { nullable: true }) parentId: string | null;

}