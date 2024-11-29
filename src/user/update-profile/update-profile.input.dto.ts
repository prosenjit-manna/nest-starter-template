import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, Matches, MinLength } from "class-validator";
import { appConfig } from "src/app.config";

@InputType()
export class UpdateProfileInput {

  @Field(() => String, { nullable: true }) 
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(appConfig.userPasswordValidationRegex, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  password: string;

}