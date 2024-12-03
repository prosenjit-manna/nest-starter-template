import { Module } from '@nestjs/common';
import { UploadMediaService } from './upload-file/upload-file.service';
import { UploadMediaController } from './upload-file/upload-controller';
import { UpdateProfileImageService } from './update-profile-image/update-profile-image.service';
import { UpdateProfileImageController } from './update-profile-image/update-profile-image.controller';
import { ListMediaService } from './list-file/list-file.service';

@Module({
  controllers: [UploadMediaController, UpdateProfileImageController],
  providers: [UploadMediaService, UpdateProfileImageService, ListMediaService],
})
export class MediaModule {}
