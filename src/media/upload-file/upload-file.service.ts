import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { join, dirname } from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { File } from '@prisma/client';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadMedia(file: Express.Multer.File, { workspaceId }: { workspaceId: string }): Promise<File> {
    // Save file information to the database
    const media = await this.prisma.file.create({
      data: {
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: file.path,
        workspaceId
      },
    });

    return media;
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const uploadPath = this.uploadPath(join(
      'uploads',
      file.originalname,
    ))

    const absUploadPath = join(
      process.cwd(),
      'public',
      uploadPath
    );
    const uploadDir = dirname(absUploadPath);

    // Ensure the uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Save the file
    await fs.writeFile(absUploadPath, file.buffer);

    return `/${uploadPath}`;
  }

  uploadPath(originalFilePath: string): string {
    const extension = path.extname(originalFilePath);
    const newFilename = `${uuidv4()}${extension}`;
    const newFilePath = path.join(path.dirname(originalFilePath), newFilename);
    return newFilePath;
  }

  async deleteFile(path: string): Promise<void> {

    // Delete file from the filesystem
    await fs.unlink(join(process.cwd(), 'public', path));
  }
}
