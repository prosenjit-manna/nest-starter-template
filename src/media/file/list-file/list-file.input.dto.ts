import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { BaseListInput } from "src/shared/base-list/base-list-input.dto";

export enum MediaOrderByField {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  size = 'size',
}

registerEnumType(MediaOrderByField, {
  name: 'mediaOrderByField',
});

@InputType()
export class ListMediaInput  extends BaseListInput  {

  @Field(() => MediaOrderByField, { nullable: true, defaultValue: MediaOrderByField.createdAt })
  orderByField?: MediaOrderByField;
}