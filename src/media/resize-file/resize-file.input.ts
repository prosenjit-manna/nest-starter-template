import { Field, InputType, Int } from '@nestjs/graphql';


@InputType()
export class ImageResizeOptions {
  /** Width of the output image. */
  @Field(() => Int, { nullable: true })
  width: number;

  /** Height of the output image. */
  @Field(() => Int, { nullable: true })
  height: number;

}

@InputType()
export class ResizeFileInput  {
  @Field(() => String)
  id: string;

  @Field(() => ImageResizeOptions) resizeOptions: ImageResizeOptions;

}
