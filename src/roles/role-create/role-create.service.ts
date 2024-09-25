import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { RoleCreateResponse } from './role-create-response.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleCreateInput } from './role-create-input.dto';

@Injectable()
export class RoleCreateService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => RoleCreateResponse)
  @UsePipes(new ValidationPipe())
  async createRole(
    @Args('roleCreateInput') roleCreateInput: RoleCreateInput,
  ): Promise<RoleCreateResponse> {
    const role = await this.prisma.role.create({
      data: roleCreateInput,
    });
    return role;
  }
}
