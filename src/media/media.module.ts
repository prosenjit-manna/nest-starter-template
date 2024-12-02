import { Module } from '@nestjs/common';
import { UploadMediaService } from './upload-media/upload-media.service';
import { UploadMediaController } from './upload-media/upload-controller';
import { UpdateProfileImageService } from './update-profile-image/update-profile-image.service';
import { UpdateProfileImageController } from './update-profile-image/update-profile-image.controller';

@Module({
  controllers: [UploadMediaController, UpdateProfileImageController],
  providers: [UploadMediaService, UpdateProfileImageService],
})
export class MediaModule {}
