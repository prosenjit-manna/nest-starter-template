import { Field, ObjectType } from "@nestjs/graphql";
import { UserType } from "@prisma/client";

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
export class CurrentUserResponse {
  @Field(() => String) 
  email: string;

  @Field(() => String, { nullable: true }) 
  name: string | null;

  @Field(() => String) 
  id: string;

  @Field(() => String) 
  userType: UserType;

  

}