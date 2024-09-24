
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostListService } from './post-list/post-list.service';
import { PostUpdateService } from './post-update/post-update.service';

@Module({
    imports: [],
    controllers: [],
    providers: [PostListService, PostUpdateService, PrismaService],
})
export class PostModule {}
