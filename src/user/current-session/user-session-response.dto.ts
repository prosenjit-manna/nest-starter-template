import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class SessionResponse {
  @Field(() => String) 
  id: string;

  @Field(() => String) 
  ip: string;

  @Field(() => String) 
  createdAt: string;

}