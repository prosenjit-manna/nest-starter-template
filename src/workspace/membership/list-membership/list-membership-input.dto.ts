import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { BaseListInput } from 'src/shared/base-list/base-list-input.dto';

export enum MembershipListOrderByField {
  createdAt = 'createdAt',
}

registerEnumType(MembershipListOrderByField, {
  name: 'membershipListOrderByField',
});

@InputType()
export class ListMembershipInput extends BaseListInput {

  @Field(() => String, { nullable: true })
  search?: string;

  orderByField?: MembershipListOrderByField;
}
