import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PasswordResetRequestInput {
  @Field(() => String)
  email: string;
}
