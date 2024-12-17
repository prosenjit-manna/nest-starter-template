import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GetFileResponse {
  @Field(() => String) id: string;
  @Field(() => String) name: string;
  @Field(() => String, { nullable: true }) description?: string;
  @Field(() => Int) size: number; 
  @Field(() => String) mimeType: string;
  @Field(() => String) url: string; 
  @Field(() => String, { nullable: true }) folderId?: string;
  @Field(() => String, { nullable: true }) authorId?: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => Date) updatedAt: Date;
  @Field(() => Date, { nullable: true }) deletedAt?: Date;
  @Field(() => String, { nullable: true }) workspaceId?: string;
  @Field(() => [GetFileResponse], { nullable: true }) resizeImages?: GetFileResponse[];
}
