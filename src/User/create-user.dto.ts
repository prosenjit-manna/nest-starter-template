import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: false })
  @IsEmail()
  email: string;


  @Field(() => String, { nullable: true })
  name: string;

}
