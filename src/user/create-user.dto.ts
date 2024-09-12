import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: false })
  @IsEmail()
  email: string;


  @Field(() => String, { nullable: true })
  @MinLength(3)
  name: string;
}
