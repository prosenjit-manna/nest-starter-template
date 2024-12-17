import { Field, ObjectType } from '@nestjs/graphql';
import { AuthTokenResponse } from '../auth-tokens-response.dto';

@ObjectType()
export class LoginResponse extends AuthTokenResponse {
  @Field() id: string;

  @Field({ nullable: true }) twoFA: boolean;
}
