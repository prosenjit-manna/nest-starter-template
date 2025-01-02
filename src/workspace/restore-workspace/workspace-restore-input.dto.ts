import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class WorkspaceRestoreInput  {
  @Field(() => String) id: string;
}
