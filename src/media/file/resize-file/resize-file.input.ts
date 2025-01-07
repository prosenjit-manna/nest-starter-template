import { Field, Float, InputType, Int } from '@nestjs/graphql';


@InputType()
export class ImageResizeOptions {
  @Field(() => Int) width: number;
  @Field(() => Int) height: number;
  @Field(() => Int) left: number;
  @Field(() => Int) top: number;
}

@InputType()
export class ResizeFileInput  {
  @Field(() => String)
  id: string;

  @Field(() => Float) scale: number;
  @Field(() => ImageResizeOptions) resizeOptions: ImageResizeOptions;

}
