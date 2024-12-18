import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class GetFileInput  {
  @Field(() => String)
  id: string;

  @Field(() => Boolean, { nullable: true })
  fromStash?: boolean;

}
