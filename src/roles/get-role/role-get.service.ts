import { HttpStatus, SetMetadata, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { RoleGetResponse, RolePrivilegeResponse } from './role-get-response.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleGetInput } from './role-get-input.dto';
import { CreateAppError } from 'src/shared/create-error/create-error';
import { RoleGuard } from 'src/auth/role.guard';
import { PrivilegeGroup, PrivilegeName } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class RoleGetService {
  constructor(private prisma: PrismaService) {}

  @Query(() => RoleGetResponse)
  @UseGuards(RoleGuard)
  @SetMetadata('privilegeGroup', PrivilegeGroup.ROLE)
  @SetMetadata('privilegeName', PrivilegeName.READ)
  @UsePipes(new ValidationPipe())
  async getRole(
    @Args('roleGetInput') roleGetInput: RoleGetInput,
  ): Promise<RoleGetResponse> {
    const role = await this.prisma.role.findFirst({
      where: {
        id: roleGetInput.id,
      }
    });

    
    if (!role) {
      throw new CreateAppError({
        message: 'Role not found',
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    const transformPrivileges: RolePrivilegeResponse[] = [];
    const privileges = await this.prisma.rolePrivilege.findMany({
      where: { roleId: role.id },
      include: { privilege: true },
    });


    privileges.forEach((privilege) => {
      transformPrivileges.push({
        id: privilege.privilege.id,
        name: privilege.privilege.name,
        group: privilege.privilege.group,
        type: privilege.privilege.type || '',
      });
    });

    return {
      ...role,
      deletedAt: role.deletedAt as any,
      privilege: transformPrivileges,
    };
  }
}
