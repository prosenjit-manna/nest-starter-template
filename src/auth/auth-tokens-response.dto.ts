import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthTokenResponse {
  @Field({ nullable: true }) token: string;
  @Field({ nullable: true }) refreshToken: string;
}
