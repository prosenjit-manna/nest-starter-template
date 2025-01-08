import { Field, InputType, Int } from '@nestjs/graphql';


@InputType()
export class ImageResizeOptions {
  @Field(() => Int) width: number;
  @Field(() => Int, { nullable: true}) height: number;
  @Field(() => Int, { nullable: true}) left: number;
  @Field(() => Int,  { nullable: true}) top: number;
}

@InputType()
export class ResizeFileInput  {
  @Field(() => String)
  id: string;

  @Field(() => ImageResizeOptions) resizeOptions: ImageResizeOptions;

}
