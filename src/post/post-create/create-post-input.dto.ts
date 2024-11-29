import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

const html = "<div>hello><script>alert('test');</script></div>";
console.log(sanitizeHtml(html));
// console.log(sanitizeHtml("<img src=x onerror=alert('img') />"));
// console.log(sanitizeHtml("console.log('hello world')"));
// console.log(sanitizeHtml("<script>alert('hello world')</script>"));

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: false })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  title: string;


  @Field(() => String, { nullable: true })
  @MaxLength(20000)
  content: string;

  @Field(() => Boolean)
  published: boolean = false;

  @Field(() => String, { nullable: true })
  authorId: string;
  
}
