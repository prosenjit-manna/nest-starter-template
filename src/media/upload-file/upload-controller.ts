import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { FileService } from './upload-file.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('media')
export class UploadMediaController {
  constructor(
    private readonly uploadMediaService: FileService,
    
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const workspaceId = req.currentWorkspaceId as string;
    const filePath = await this.uploadMediaService.saveFile(file);
    const media = await this.uploadMediaService.uploadMedia({ ...file, path: filePath }, { workspaceId });
    return media;
  }
}