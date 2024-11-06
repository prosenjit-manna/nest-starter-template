import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateWorkspaceInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Transform(({ value }) => value.trim())
  name: string;
}