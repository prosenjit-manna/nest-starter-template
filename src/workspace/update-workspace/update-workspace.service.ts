import { SetMetadata, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';

import { UpdateWorkspaceResponse } from './update-workspace-response.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { PrismaService } from 'src/prisma.service';
import { UpdateWorkspaceInput } from './update-workspace-input.dto';

@UseGuards(JwtAuthGuard)
@Resolver()
export class UpdateWorkspaceService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => UpdateWorkspaceResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.WORKSPACE)
  @SetMetadata('privilegeName', PrivilegeName.UPDATE)
  @UsePipes(new ValidationPipe())
  async updateWorkspace(
    @Args('updateWorkspaceInput') updateWorkspaceInput: UpdateWorkspaceInput,
  ): Promise<UpdateWorkspaceResponse> {

    const workspace = await this.prisma.workspace.update({
      where: {
        id: updateWorkspaceInput.id,
      },
      data: {
        name: updateWorkspaceInput.name,
      },
    });
    
    return workspace;
  }
}
