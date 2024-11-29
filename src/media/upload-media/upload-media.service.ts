import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Express } from 'express';
import { join, dirname } from 'path';
import { promises as fs } from 'fs';
import appEnv from 'src/env';

@Injectable()
export class UploadMediaService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadMedia(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Save file information to the database
    const media = await this.prisma.file.create({
      data: {
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `${appEnv.BACKEND_URL}/uploads/${file.originalname}`,
      },
    });

    return media;
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadPath = join(process.cwd(), 'public', 'uploads', file.originalname);
    const uploadDir = dirname(uploadPath);

    // Ensure the uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Save the file
    await fs.writeFile(uploadPath, file.buffer);
    return uploadPath;
  }
}
