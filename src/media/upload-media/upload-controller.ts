import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadMediaService } from './upload-media.service';
import { UpdateProfileImageService } from '../update-profile-image/update-profile-image.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('media')
export class UploadMediaController {
  constructor(
    private readonly uploadMediaService: UploadMediaService,
    private readonly updateProfileImage: UpdateProfileImageService,
    
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = await this.uploadMediaService.saveFile(file);
    const media = await this.uploadMediaService.uploadMedia({ ...file, path: filePath });
    return media;
  }
}