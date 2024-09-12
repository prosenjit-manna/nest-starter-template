
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    imports: [],
    controllers: [],
    providers: [PostService, PrismaService],
})
export class PostModule {}
