import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PassWordResetResponse {
  @Field() message: string;
}