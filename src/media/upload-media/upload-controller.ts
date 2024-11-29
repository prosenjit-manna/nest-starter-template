import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadMediaService } from './upload-media.service';

@Controller('media')
export class UploadMediaController {
  constructor(private readonly uploadMediaService: UploadMediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    // const userId = req.user.id; // Assuming you have user information in the request
    const filePath = await this.uploadMediaService.saveFile(file);
    const media = await this.uploadMediaService.uploadMedia({ ...file, path: filePath });
    return media;
  }
}