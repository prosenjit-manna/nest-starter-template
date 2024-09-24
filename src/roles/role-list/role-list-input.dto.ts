import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { BaseListInput } from 'src/shared/base-list/base-list-input.dto';


export enum RoleListOrderByField {
  id = 'id',
  title = 'title',
  authorId = 'authorId',
  published = 'published'
}

registerEnumType(RoleListOrderByField, {
  name: 'roleOrderByField',
});

@InputType()
export class RoleListInput extends BaseListInput {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => Int, { nullable: true })
  authorId: string;

  @Field(() => RoleListOrderByField, { nullable: true, defaultValue: RoleListOrderByField.id })
  orderByField?: RoleListOrderByField;
}
