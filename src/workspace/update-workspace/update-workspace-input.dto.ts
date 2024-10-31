import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateWorkspaceInput {
  @Field()
  id: string;

  @Field()
  name: string;
}