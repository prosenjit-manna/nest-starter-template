import { Field, InputType, Int } from '@nestjs/graphql';
import { PaginationInput } from 'src/shared/pagination/pagination-input.dto';


@InputType()
export class GetPostListInput extends PaginationInput {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => Int, { nullable: true })
  authorId: number;
}
