import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { File } from '@prisma/client';

@Injectable()
export class UpdateProfileImageService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfileMedia(media: File, userId: string) {
    const response = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImage: media.url,
      },
    });

    return {
      success: true,
      profileImage: response.profileImage,
    }
  }
}
