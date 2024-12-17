import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteFolderInput {
  @Field() id: string;

  @Field(() => Boolean, { nullable: true })
  fromStash?: boolean;
}