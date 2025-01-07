import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
class User {
  @Field() id: string;
  @Field() name: string;
  @Field() email: string;
}


@ObjectType()
export class MembershipResponse {
  @Field() id: string;
  @Field() workspaceId: string;
  @Field() isOwner: boolean;
  @Field() isAccepted: boolean;
  @Field() user: User;
}