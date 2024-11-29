import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma.service';
import { UpdateProfileResponse } from './update-profile.response.dto';
import { UpdateProfileInput } from './update-profile.input.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class UpdateProfileService {
  constructor(private readonly prisma: PrismaService) {}

  @Mutation(() => UpdateProfileResponse)
  async updateProfile(
    @Context('req') req: Request,
    @Args('updateProfileInput', { nullable: true })
    updateProfileInput: UpdateProfileInput,
  ): Promise<UpdateProfileResponse> {

    const filteredInput: Partial<UpdateProfileInput> = Object.keys(updateProfileInput)
    .filter(key => updateProfileInput[key as keyof UpdateProfileInput])
    .reduce((obj, key) => {
      obj[key as keyof UpdateProfileInput] = updateProfileInput[key as keyof UpdateProfileInput]!;
      return obj;
    }, {} as Partial<UpdateProfileInput>);

    if (filteredInput.password) {
      filteredInput.password = await bcrypt.hash(filteredInput.password, 10);
    }

    await this.prisma.user.update({
      where: {
        id: req.user?.id,
      },
      data: filteredInput,
    });

    return {
      success: true,
    };
  }
}
