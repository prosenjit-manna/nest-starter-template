import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUserResponse } from './get-users.response.dto';
import { GetUsersInput } from './get-users-input.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';
import appEnv from 'src/env';

@UseGuards(JwtAuthGuard)
@Resolver()
export class GetUserService {
  constructor(private prisma: PrismaService) {}

  @Query(() => [GetUserResponse])
  async getUsers(
    @Args('getUsersInput', { nullable: true })
    getUsersInput: GetUsersInput,
  ): Promise<User[]> {
    const userQuery: Prisma.UserWhereInput = {
      OR: [
        {
          name: {
            contains: getUsersInput?.search || undefined,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: getUsersInput?.search || undefined,
            mode: 'insensitive',
          },
        },
      ],
    };

    const users = await this.prisma.user.findMany({
      where: getUsersInput?.search ? userQuery : undefined,
      take: appEnv.PAGE_SIZE,
    });
    return users;
  }
}
