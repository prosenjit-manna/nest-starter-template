import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { PrivilegeType } from "@prisma/client";

registerEnumType(PrivilegeType, {
  name: 'type',
});

@ObjectType()
export class PrivilegeResponse {
  @Field() name: string;
  @Field() group: string;
  @Field() id: string;
  @Field(() => PrivilegeType ) type: PrivilegeType;
  @Field() createdAt: Date;
  @Field() updatedAt: Date;
  @Field({ nullable: true }) deletedAt: Date;
}