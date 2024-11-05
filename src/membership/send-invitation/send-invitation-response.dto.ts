import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SendInvitationResponse {
  @Field(() => Boolean, { nullable: true })
  success?: boolean;
}