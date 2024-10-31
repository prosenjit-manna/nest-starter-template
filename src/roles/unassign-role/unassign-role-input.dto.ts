import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UnAssignRoleInput {
  @Field(() => String)
  roleId: string;

  @Field(() => String)
  userId: string;
}
