import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostListService } from './post-list/post-list.service';
import { PostUpdateService } from './post-update/post-update.service';
import { PostCreateService } from './post-create/post-create.service';
import { GetPostService } from './get-post/get-post.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PostListService,
    GetPostService,
    PostCreateService,
    PostUpdateService,
    PrismaService,
  ],
})
export class PostModule {}
