import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UnauthorizedException,
  Response,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/core';
import { isAjax } from 'src/utils';
import { FilesService } from './files.service';
import {
  GetFileDto,
  getFileSchema,
  UploadFileDto,
  uploadFileSchema,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BucketsService } from 'src/buckets';
import { RequestUser, User } from 'src/user';
import { Request as Req, Response as Res } from 'express';
import { File as FileMetadata } from './entities';
import { ForceAuth, Public } from 'src/auth';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly bucketsService: BucketsService,
  ) {}

  @Post('upload/:bucketKey')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('bucketKey') bucketKey: string,
    @RequestUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(uploadFileSchema))
    uploadFileDto: UploadFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    console.log({ uploadFileDto });

    if (file.originalname === 'blob' && uploadFileDto.filename) {
      file.originalname = uploadFileDto.filename;
    }

    console.log({ file });

    const bucket = await this.bucketsService.findOne(bucketKey);
    const hasAccess = this.bucketsService.canAccess(user, bucket);

    if (!hasAccess) {
      throw new UnauthorizedException('Unauthorized action');
    }

    return this.filesService.uploadFile(bucket, file, uploadFileDto);
  }

  @Public()
  @ForceAuth()
  @Get('path/:bucketKey/:filename')
  async getFile(
    @Response() res: Res,
    @Request() req: Req,
    @RequestUser() user: User,
    @Param('bucketKey') bucketKey: string,
    @Param('filename') filePath: string,
    @Body(new ZodValidationPipe(getFileSchema)) getFileDto: GetFileDto,
  ) {
    const bucket = await this.bucketsService.findOne(bucketKey);
    const hasAccess = this.bucketsService.canAccess(user, bucket.dataValues);

    if (!hasAccess) {
      throw new UnauthorizedException('Unauthorized action');
    }

    const { file, metadata } = await this.filesService.getFile(
      bucket.dataValues,
      filePath,
      getFileDto.password,
    );

    const statusCode = !isAjax(req)
      ? HttpStatus.OK
      : HttpStatus.PARTIAL_CONTENT;

    return res
      .status(statusCode)
      .set(this.getSendFileHeaders(metadata, file))
      .send(file);
  }

  private getSendFileHeaders(metadata: FileMetadata, file: Buffer) {
    return {
      'Content-Type': metadata.mimeType,
      'Content-Disposition': `attachment; filename="${metadata.name}${metadata.extension}"`,
      'Content-Transfer-Encoding': 'binary',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private',
      'Content-Length': file.byteLength,
      Pragma: 'private',
    };
  }

  // @Delete(':id')
  // public destroy(@Param('id') id: string) {
  //   return this.filesService.remove(+id);
  // }
}
