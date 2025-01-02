import { Module } from '@nestjs/common';
import { PostListService } from './post-list/post-list.service';
import { PostUpdateService } from './post-update/post-update.service';
import { PostCreateService } from './post-create/post-create.service';
import { GetPostService } from './get-post/get-post.service';
import { PostDeleteService } from './post-delete/post-delete.service';
import { PostMemberShipValidation } from './post-membership-validation';
import { PostRestoreService } from './post-restore/post-restore.service';

@Module({
  providers: [
    PostMemberShipValidation,
    PostListService,
    GetPostService,
    PostCreateService,
    PostUpdateService,
    PostDeleteService,
    PostRestoreService,
  ],
})
export class PostModule {}
