import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { BaseListInput } from 'src/shared/base-list/base-list-input.dto';

export enum WorkSpaceOrderByField {
  createdAt = 'createdAt',
  name = 'name',
}

registerEnumType(WorkSpaceOrderByField, {
  name: 'workspaceOrderByField',
});

@InputType()
export class ListWorkSpaceInput extends BaseListInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  authorId: string;

  @Field(() => WorkSpaceOrderByField, {
    nullable: true,
    defaultValue: WorkSpaceOrderByField.createdAt,
  })
  orderByField?: WorkSpaceOrderByField;
}
