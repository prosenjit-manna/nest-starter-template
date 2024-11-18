import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateWorkspaceInput {
  @Field()
  id: string;

  @Field()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  name: string;
}