import { Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserResponse } from './user.response.dto';

@Resolver()
export class UserService {
  constructor(private prisma: PrismaService) {}
  @Query(() => [UserResponse])
  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;

  }
}
