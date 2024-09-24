import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class UpdatePostInput {
  @Field(() => String, { nullable: true })
  title: string;


  @Field(() => String, { nullable: true })
  @MaxLength(3000)
  content: string;

  @Field(() => Boolean)
  published: boolean = false;

  @Field(() => String, { nullable: true })
  authorId: string;
  
}
