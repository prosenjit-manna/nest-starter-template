import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PassWordResetRequestResponse {
  @Field() message: string;
}