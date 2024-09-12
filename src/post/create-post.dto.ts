import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: false })
  title: string;


  @Field(() => String, { nullable: true })
  @MaxLength(3000)
  content: string;

  @Field(() => Boolean)
  published: boolean = false;

  @Field(() => Int, { nullable: false })
  authorId: number;
  
}
