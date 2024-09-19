import { Field, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class UserRole {
  @Field() id: string;
  @Field() name: string;
}
@ObjectType()
export class UserResponse {
  @Field() email: string;
  @Field() name: string;
  @Field() id: string;
  @Field() role: UserRole[];
}

