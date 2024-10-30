import { Module } from '@nestjs/common';
import { PostListService } from './post-list/post-list.service';
import { PostUpdateService } from './post-update/post-update.service';
import { PostCreateService } from './post-create/post-create.service';
import { GetPostService } from './get-post/get-post.service';
import { PostDeleteService } from './post-delete/post-delete.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PostListService,
    GetPostService,
    PostCreateService,
    PostUpdateService,
    PostDeleteService,
  ],
})
export class PostModule {}
