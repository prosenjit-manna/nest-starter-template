import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

import { UploadMediaService } from "../upload-file/upload-file.service";
import { UpdateProfileImageService } from "./update-profile-image.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";


@UseGuards(JwtAuthGuard)
@Controller('media')
export class UpdateProfileImageController {
  constructor(
    private readonly uploadMediaService: UploadMediaService,
    private readonly updateProfileImage: UpdateProfileImageService,
  ) {}

  @Post('profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const filePath = await this.uploadMediaService.saveFile(file);
    const media = await this.uploadMediaService.uploadMedia({ ...file, path: filePath }, { workspaceId: req.currentWorkspaceId as string });
    return await this.updateProfileImage.updateProfileMedia(media, req.user?.id || '');
  }
}