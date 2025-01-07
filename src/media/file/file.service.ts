import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { join, dirname } from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { File } from '@prisma/client';
import * as sharp from 'sharp';


@Injectable()
export class FileService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

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


  async resizeFile(file: File, resizeInput: sharp.Region, scale: number) {

    const originalFilePath = join(process.cwd(), 'public',file.url);

    const extension = path.extname(originalFilePath);
    const basePath = originalFilePath.replace(extension, '');

    let filePath = '';

    if (resizeInput.left) {
      filePath += 'x-' + resizeInput.left;
    }

    if (resizeInput.top) {
      filePath += 'y-' + resizeInput.top;
    }

    if (resizeInput.width) {
      filePath += 'w-' + resizeInput.width;
    }
    if (resizeInput.width && resizeInput.height) {
      filePath += 'x';
    }
    if (resizeInput.height) {
      filePath += 'h-' + resizeInput.height;
    }

    const metadata = await sharp(originalFilePath).metadata();
    const newFilePath = `${basePath}${filePath ? '-' + filePath : ''}${extension}`;
    
    if (metadata.width && metadata.height) {
      await sharp(originalFilePath).extract(resizeInput).resize(metadata.width * scale, metadata.height * scale).toFile(newFilePath);
    }
    
    return newFilePath.replace(join(process.cwd(), 'public'), '');
  }
}
