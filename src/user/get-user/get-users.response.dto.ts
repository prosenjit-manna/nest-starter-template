import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GetUserResponse {
  @Field(() => String) 
  email: string;

  @Field(() => String, { nullable: true }) 
  name: string | null;

  @Field(() => String) 
  id: string | null;

}