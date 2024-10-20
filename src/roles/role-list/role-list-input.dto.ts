import { Field, InputType,  registerEnumType } from '@nestjs/graphql';
import { BaseListInput } from 'src/shared/base-list/base-list-input.dto';


export enum RoleListOrderByField {
  createdAt = 'createdAt',
  title = 'title',
}

registerEnumType(RoleListOrderByField, {
  name: 'roleOrderByField',
});

@InputType()
export class RoleListInput extends BaseListInput {
  @Field(() => String, { nullable: true })
  title: string;


  @Field(() => RoleListOrderByField, { nullable: true, defaultValue: RoleListOrderByField.title })
  orderByField?: RoleListOrderByField;
}
