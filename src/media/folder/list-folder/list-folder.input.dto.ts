import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { BaseListInput } from 'src/shared/base-list/base-list-input.dto';

export enum FolderListOrderByField {
  id = 'id',
  title = 'title',
  authorId = 'authorId',
  published = 'published',
}

registerEnumType(FolderListOrderByField, {
  name: 'FolderOrderByField',
});

@InputType()
export class ListFolderInput extends BaseListInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => FolderListOrderByField, {
    nullable: true,
    defaultValue: FolderListOrderByField.id,
  })
  orderByField?: FolderListOrderByField;
}
