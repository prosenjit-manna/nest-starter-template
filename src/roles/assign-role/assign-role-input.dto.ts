import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AssignRoleInput {
  @Field(() => String)
  roleId: string;

  @Field(() => String)
  userId: string;
}
