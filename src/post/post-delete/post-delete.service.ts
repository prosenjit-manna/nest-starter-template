import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { PostDeleteInput } from './post-delete-input.dto';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';

@Resolver()
export class PostDeleteService {
  constructor(private prismaService: PrismaService) {}

  @Mutation(() => Boolean)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.POST)
  @SetMetadata('privilegeName', PrivilegeName.DELETE)
  async deletePost(
    @Args('postDeleteInput', { nullable: true })
    postDeleteInput: PostDeleteInput,
  ): Promise<boolean> {

    const post = await this.prismaService.post.findUnique({
      where: { id: postDeleteInput.id, deletedAt: postDeleteInput.fromStash ? { not: null } : null },
    });

    if (!post) {
      throw new CreateAppError({
        message: 'Post not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    try {
      if (postDeleteInput.fromStash) {
        await this.prismaService.post.delete({ where: { id: postDeleteInput.id } });
      } else {
        await this.prismaService.post.update({
          where: { id: postDeleteInput.id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
      }

      return true;
    } catch (error) {
      throw new CreateAppError({
        message: 'Unable to Delete Post',
        httpStatus: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }
}
