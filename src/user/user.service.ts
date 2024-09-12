import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserResponse } from './user.response.dto';
import { CreateUserInput } from './create-user.dto';
import { CreateUserResponse } from './create-user-response.dto';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../validator.pipe';

@Resolver()
export class UserService {
  constructor(private prisma: PrismaService) {}
  @Query(() => [UserResponse])
  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  @Mutation(() => CreateUserResponse)
  @UsePipes(new ValidationPipe())
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<CreateUserResponse> {

    const user = await this.prisma.user.create({ data: createUserInput });
    return { id: user.id };

  }

  @Mutation(() => CreateUserResponse)
  @UsePipes(new ValidationPipe())
  async listUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<CreateUserResponse> {

    const user = await this.prisma.user.create({ data: createUserInput });
    return { id: user.id };

  }
}
