import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class PostRestoreInput  {
  @Field(() => String) id: string;
}
