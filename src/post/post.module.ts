
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostListService } from './post-list/post-list.service';

@Module({
    imports: [],
    controllers: [],
    providers: [PostListService, PrismaService],
})
export class PostModule {}
