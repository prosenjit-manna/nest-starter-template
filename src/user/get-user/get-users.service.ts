import { Args, Query, Resolver } from "@nestjs/graphql";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { GetUserResponse } from "./get-users.response.dto";
import { GetUsersInput } from "./get-users-input.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { appConfig } from "src/app.config";

@UseGuards(JwtAuthGuard)
@Resolver()
export class GetUserService {
  constructor(private prisma: PrismaService) {}

  @Query(() => [GetUserResponse])
  async getUsers(
    @Args('getUsersInput', { nullable: true })
    getUsersInput: GetUsersInput,
  ): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
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
      },
      take: appConfig.pageSize
    });
    return users;
  }
}