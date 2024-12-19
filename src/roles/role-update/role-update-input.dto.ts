import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { RoleName } from '@prisma/client'; // Assuming Prisma is properly set up
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

// Register the RoleName enum for GraphQL
registerEnumType(RoleName, {
  name: 'RoleName', // The name used in GraphQL schema
});

@InputType()
export class RoleUpdateInput {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: false })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  title: string;

  @Field(() => String, { nullable: true })
  @Transform(({ value }) => value?.trim() || null)
  @IsOptional()
  @MaxLength(255)
  description: string | null;

  @Field(() => [String])
  createPrivileges: string[];

  @Field(() => [String])
  removePrivileges: string[];
}
