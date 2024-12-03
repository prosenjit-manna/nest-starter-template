import { Field, Int, ObjectType } from "@nestjs/graphql";
// import { AccessLevel } from './access-level.enum'; // Assuming you have an AccessLevel enum defined

@ObjectType()
export class FileResponse {
  @Field(() => String) id: string;
  @Field(() => String) name: string;
  @Field(() => String, { nullable: true }) description?: string;
  @Field(() => Int) size: number; // File size in kb
  @Field(() => String) mimeType: string; // MIME type (e.g., "image/png", "application/pdf")
  @Field(() => String) url: string; // Path or URL to the file
  @Field(() => String, { nullable: true }) folderId?: string;
  @Field(() => String, { nullable: true }) authorId?: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => Date) updatedAt: Date;
  @Field(() => Date, { nullable: true }) deletedAt?: Date;
  @Field(() => String, { nullable: true }) workspaceId?: string;
  // @Field(() => AccessLevel, { nullable: true, defaultValue: AccessLevel.RESTRICTED }) accessLevel?: AccessLevel;
}