import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(Order, {
  name: 'Order',
});
@InputType()
export class BaseListInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;

  @Field(() => Order, { defaultValue: Order.DESC })
  orderBy?: Order;
}
