import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RoleCreateResponse } from './role-create-response.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleCreateInput } from './role-create-input.dto';

@Resolver()
export class RoleCreateService {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => RoleCreateResponse)
  @UsePipes(new ValidationPipe())
  async createRole(
    @Args('roleCreateInput') roleCreateInput: RoleCreateInput,
  ): Promise<RoleCreateResponse> {
    const role = await this.prisma.role.create({
      data: {
        name: roleCreateInput.name,
        title: roleCreateInput.title,
      },
    });

    console.log(roleCreateInput.privileges);

    console.log(roleCreateInput.privileges.map((privilege) => ({
      roleId: role.id,
      privilegeId: privilege,
    })))

    // assign base privileges to the role

    await this.prisma.rolePrivilege.createMany({
      data: roleCreateInput.privileges.map((privilege) => ({
        roleId: role.id,
        privilegeId: privilege,
      })),
    });

    return role;
  }
}
