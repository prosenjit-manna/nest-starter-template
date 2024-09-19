import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserRole {
  @Field(() => String)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  roleId: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => String) 
  email: string;

  @Field(() => String) 
  name: string;

  @Field(() => String) 
  id: string;

  @Field(() => [UserRole]) 
  UserRole: UserRole[];
}