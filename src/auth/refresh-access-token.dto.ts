import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RefreshAccessTokenInput {
  @Field(() => String)
  refreshToken: string;
}
