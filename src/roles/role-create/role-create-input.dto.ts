import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { RoleName } from '@prisma/client'; // Assuming Prisma is properly set up

// Register the RoleName enum for GraphQL
registerEnumType(RoleName, {
  name: 'RoleName', // The name used in GraphQL schema
});

@InputType()
export class RoleCreateInput {
  @Field(() => String, { nullable: false })
  title: string;

  @Field(() => RoleName, { defaultValue: RoleName.CUSTOM })
  name: RoleName;

  @Field(() => [String])
  privileges: string[];
  
}