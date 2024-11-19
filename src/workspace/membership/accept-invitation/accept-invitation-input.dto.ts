import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AcceptInvitationInput {
  @Field(() => String)
  token: string;

  @Field(() => Boolean)
  accept: boolean;
}
