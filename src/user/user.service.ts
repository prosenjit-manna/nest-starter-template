import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserResponse } from './user.response.dto';
import { CreateUserInput } from './create-user.dto';
import { CreateUserResponse } from './create-user-response.dto';
import { UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../validator.pipe';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
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
    
    const result = await this.prisma.user.findFirst(
      { where: { email: createUserInput.email } },
    );

    if (result) {
      throw new Error('User already exists');
    }

    const user = await this.prisma.user.create({ data: createUserInput });
    return { id: user.id };
  }

}
