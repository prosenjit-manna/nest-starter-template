import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class MemberShipRestoreInput  {
  @Field(() => String) id: string;
}
