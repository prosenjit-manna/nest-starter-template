import { Field, ObjectType } from "@nestjs/graphql";



@ObjectType()
export class CurrentPrivilegeResponse {
  @Field(() => String) 
  name: string;

  @Field(() => String) 
  type: string;

  @Field(() => String, { nullable: true }) 
  userId: string;

  @Field(() => String, { nullable: true }) 
  roleId: string;

}