import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UpdateWorkspaceResponse {
  @Field()
  id: string;
}