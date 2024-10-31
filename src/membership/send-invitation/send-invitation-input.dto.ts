import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SendInvitationInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  workspaceId: string;
}
