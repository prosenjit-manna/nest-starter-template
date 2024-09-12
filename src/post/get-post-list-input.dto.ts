import { Field, InputType } from '@nestjs/graphql';
import { PaginationInput } from 'src/shared/pagination/pagination-input.dto';


@InputType()
export class GetPostListInput extends PaginationInput {
  @Field(() => String, { nullable: true })
  title: string;
}
