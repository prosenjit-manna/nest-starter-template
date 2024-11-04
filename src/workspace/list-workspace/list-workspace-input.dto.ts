import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { BaseListInput } from 'src/shared/base-list/base-list-input.dto';


export enum WorkSpaceOrderByField {
  id = 'id',
  name = 'title',
}

registerEnumType(WorkSpaceOrderByField, {
  name: 'workspaceOrderByField',
});

@InputType()
export class ListWorkSpaceInput extends BaseListInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => Int, { nullable: true })
  authorId: string;

  @Field(() => WorkSpaceOrderByField, { nullable: true, defaultValue: WorkSpaceOrderByField.id })
  orderByField?: WorkSpaceOrderByField;
  
}
