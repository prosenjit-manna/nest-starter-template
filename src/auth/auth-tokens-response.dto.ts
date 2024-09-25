import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthTokenResponse {
  @Field() token: string;
  @Field() refreshToken: string;
}
