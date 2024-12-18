import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OtpLoginInput {
  @Field(() => String)
  email: string;

  @Field(() => Number)
  otp: number;
}
