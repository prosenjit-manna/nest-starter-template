import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RoleGetInput {
  @Field(() => String)
  id: string;
}
