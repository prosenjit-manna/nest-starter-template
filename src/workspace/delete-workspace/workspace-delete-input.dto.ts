import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class WorkspaceDeleteInput  {
  @Field(() => String)
  id: string;

  @Field(() => Boolean, { nullable: true })
  fromStash?: boolean;

}
