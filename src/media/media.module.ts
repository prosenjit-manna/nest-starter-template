import { Module } from '@nestjs/common';
import { FileService } from './file/file.service';
import { UploadMediaController } from './file/upload-file/upload-controller';
import { UpdateProfileImageService } from './update-profile-image/update-profile-image.service';
import { UpdateProfileImageController } from './update-profile-image/update-profile-image.controller';
import { ListMediaService } from './file/list-file/list-file.service';
import { DeleteFileService } from './file/delete-file/delete-file.service';
import { ResizeFileService } from './file/resize-file/resize-file.service';
import { GetFileService } from './file/get-file/get-file.service';
import { CreateFolderService } from './folder/create-folder/create-folder.service';
import { GetFolderService } from './folder/get-folder/get-folder.service';
import { DeleteFolderService } from './folder/delete-folder/delete-folder.service';
import { ListFolderService } from './folder/list-folder/list-folder.service';

@Module({
  controllers: [UploadMediaController, UpdateProfileImageController],
  providers: [
    FileService,
    UpdateProfileImageService,
    ListMediaService,
    DeleteFileService,
    ResizeFileService,
    GetFileService,
    CreateFolderService,
    GetFolderService,
    DeleteFolderService,
    ListFolderService,
  ],
})
export class MediaModule {}
