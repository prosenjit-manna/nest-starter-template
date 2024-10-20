import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { Prisma } from '@prisma/client';

@Resolver()
export class PostDeleteService {
  constructor(private prismaService: PrismaService) {}

  @Mutation(() => Boolean)
  async deletePost(@Args('id') id: string, @Args('fromStash', { nullable: true }) fromStash: boolean): Promise<boolean> {
    try {
      let query: Prisma.PostWhereUniqueInput;

      if (fromStash) {
        query = { id };
      } else {
        query = { id, deletedAt: null };
      }

      await this.prismaService.post.update({
        where: query,
        data: { deletedAt: new Date() },
      });
      
      return true;
    } catch (error) {
      throw new CreateAppError({ message: 'Post not found', httpStatus: 404, error });
    }
  }
}
