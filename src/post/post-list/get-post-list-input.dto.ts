import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { BaseListInput } from 'src/shared/base-list/base-list-input.dto';


export enum PostListOrderByField {
  id = 'id',
  title = 'title',
  authorId = 'authorId',
  published = 'published'
}

registerEnumType(PostListOrderByField, {
  name: 'orderByField',
});

@InputType()
export class GetPostListInput extends BaseListInput {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => Int, { nullable: true })
  authorId: string;

  @Field(() => PostListOrderByField, { nullable: true, defaultValue: PostListOrderByField.id })
  orderByField?: PostListOrderByField;
  
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  fromStash?: boolean;
}
