import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateFolderInput {
  @Field(() => String) id: string;
  @Field(() => String, { nullable: true }) name: string;
  @Field(() => String, { nullable: true }) parentId: string;
}