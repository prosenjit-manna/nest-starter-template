import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CreateWorkspaceResponse {
  @Field()
  id: string;
}