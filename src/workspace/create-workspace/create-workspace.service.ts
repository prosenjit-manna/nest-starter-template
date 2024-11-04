import { SetMetadata, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';

import { CreateWorkspaceResponse } from './create-workspace-response.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkspaceInput } from './create-workspace-input.dto';

@UseGuards(JwtAuthGuard)
@Resolver()
export class CreateWorkspaceService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => CreateWorkspaceResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.WORKSPACE)
  @SetMetadata('privilegeName', PrivilegeName.CREATE)
  @UsePipes(new ValidationPipe())
  async createWorkspace(
    @Args('createWorkspaceInput') createWorkspaceInput: CreateWorkspaceInput,
  ): Promise<CreateWorkspaceResponse> {

    const workspace = await this.prisma.workspace.create({
      data: {
        name: createWorkspaceInput.name,
      },
    });
    
    return workspace;
  }
}
