import { Module } from "@nestjs/common";
import { UploadMediaService } from "./upload-media/upload-media.service";
import { UploadMediaController } from "./upload-media/upload-controller";

@Module({
  controllers: [UploadMediaController],
  providers: [
    UploadMediaService
  ],
})
export class MediaModule {
}
