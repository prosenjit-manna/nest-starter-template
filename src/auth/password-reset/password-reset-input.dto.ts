import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PasswordResetInput {
  @Field(() => String)
  password: string;

}
