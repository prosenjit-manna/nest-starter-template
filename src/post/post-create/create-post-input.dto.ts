import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: false })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  title: string;


  @Field(() => String, { nullable: true })
  @MaxLength(3000)
  content: string;

  @Field(() => Boolean)
  published: boolean = false;

  @Field(() => String, { nullable: true })
  authorId: string;
  
}
