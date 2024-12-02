import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Matches, MinLength } from 'class-validator';
import { appConfig } from '../../app.config';


@InputType()
export class SignupInput {
  @Field({ nullable: true })
  name: string;

  @Field(() => String)
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  
  @Field(() => String)
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(appConfig.userPasswordValidationRegex, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  password: string;
}
