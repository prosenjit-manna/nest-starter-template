import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';

@Resolver()
export class PostDeleteService {
  constructor(private prismaService: PrismaService) {}

  @Mutation(() => Boolean)
  async deletePost(@Args('id') id: string, @Args('fromStash', { nullable: true }) fromStash: boolean): Promise<boolean> {
    try {
      if (fromStash) {
        await this.prismaService.post.delete({
          where: { id },
        });
        return true;
      } else {
        await this.prismaService.post.update({
          where: {
            id: id,
            deletedAt: null,
          },
          data: { deletedAt: new Date() },
        });
        return true;
      }
    } catch (error) {
      throw new CreateAppError({ message: 'Post not found', httpStatus: 404, error });
    }
  }
}
