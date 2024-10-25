import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RolePrivilegeResponse {
  @Field() group: string;
  @Field() name: string;
  @Field() id: string;
  @Field() type: string;
}

@ObjectType()
export class RoleGetResponse {
  @Field() title: string;
  @Field() name: string;
  @Field() id: string;
  @Field() createdAt: Date;
  @Field() updatedAt: Date;
  @Field({ nullable: true }) deletedAt: Date;

  @Field(() => [RolePrivilegeResponse])
  privilege: RolePrivilegeResponse[];
}