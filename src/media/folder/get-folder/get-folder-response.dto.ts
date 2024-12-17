import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetFolderResponse {
  @Field() name: string;
  @Field() id: string;
  @Field({ nullable: true }) parentId: string;

  @Field(() => [GetFolderResponse], { nullable: true })
  subFolders?: GetFolderResponse[];

  @Field() createdAt: Date;
  @Field() updatedAt: Date;
  @Field({ nullable: true }) deletedAt: Date;
}
