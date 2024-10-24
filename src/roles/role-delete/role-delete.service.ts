import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { HttpStatus } from '@nestjs/common';
import { RoleDeleteInput } from './role-delete-input.dto';

@Resolver()
export class RoleDeleteService {
  constructor(private prismaService: PrismaService) {}

  @Mutation(() => Boolean)
  async deleteRole(
    @Args('roleDeleteInput', { nullable: true })
    roleDeleteInput: RoleDeleteInput,
  ): Promise<boolean> {

    const role = await this.prismaService.role.findUnique({
      where: { id: roleDeleteInput.id, deletedAt: roleDeleteInput.fromStash ? undefined : { not: null } },
    });

    if (!role) {
      throw new CreateAppError({
        message: 'Role not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    try {
      if (roleDeleteInput.fromStash) {
        await this.prismaService.role.delete({ where: { id: roleDeleteInput.id } });
      } else {
        await this.prismaService.role.update({
          where: { id: roleDeleteInput.id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
      }

      return true;
    } catch (error) {
      throw new CreateAppError({
        message: 'Unable to Delete Role',
        httpStatus: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }
}
