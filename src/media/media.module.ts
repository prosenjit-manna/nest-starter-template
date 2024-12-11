import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { UploadMediaController } from './upload-file/upload-controller';
import { UpdateProfileImageService } from './update-profile-image/update-profile-image.service';
import { UpdateProfileImageController } from './update-profile-image/update-profile-image.controller';
import { ListMediaService } from './list-file/list-file.service';
import { DeleteFileService } from './delete-file/delete-file.service';
import { ResizeFileService } from './resize-file/resize-file.service';
import { GetFileService } from './get-file/get-file.service';

@Module({
  controllers: [UploadMediaController, UpdateProfileImageController],
  providers: [
    FileService,
    UpdateProfileImageService,
    ListMediaService,
    DeleteFileService,
    ResizeFileService,
    GetFileService,
  ],
})
export class MediaModule {}
