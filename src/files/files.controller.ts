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
import { getSendFileHeaders, isAjax } from 'src/utils';
import { FilesService } from './files.service';
import {
  GetFileDto,
  getFileSchema,
  UploadFileDto,
  uploadFileSchema,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BucketsService } from 'src/buckets';
import { RequestUser, User } from 'src/users';
import { Request as Req, Response as Res } from 'express';
import { File as FileMetadata } from './entities';
import { DontThrowAccessErrors } from 'src/auth';
import { FileDispositionHeader } from './files.enum';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly bucketsService: BucketsService,
  ) {}

  @Post(':bucketKey')
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

    if (file.originalname === 'blob') {
      file.originalname =
        uploadFileDto.originalname || uploadFileDto.filename || 'blob';
    }

    const bucket = await this.bucketsService.findOne(bucketKey);
    const hasAccess = this.bucketsService.canAccess(user, bucket);

    if (!hasAccess) {
      throw new UnauthorizedException('Unauthorized action');
    }

    return this.filesService.uploadFile(bucket, file, uploadFileDto);
  }

  @Get(':bucketKey/:filename')
  @DontThrowAccessErrors()
  async getFile(
    @Response() res: Res,
    @Request() req: Req,
    @RequestUser() user: User,
    @Param('bucketKey') bucketKey: string,
    @Param('filename') filename: string,
    @Body(new ZodValidationPipe(getFileSchema)) getFileDto: GetFileDto,
  ) {
    const bucket = await this.bucketsService.findOne(bucketKey);
    const hasAccess = this.bucketsService.canAccess(user, bucket.dataValues);

    if (!hasAccess) {
      throw new UnauthorizedException('Unauthorized action');
    }

    const { file, metadata } = await this.filesService.getFile(
      bucket.dataValues,
      filename,
      getFileDto.password,
    );

    const isAjaxRequest = isAjax(req);
    const statusCode = !isAjaxRequest
      ? HttpStatus.OK
      : HttpStatus.PARTIAL_CONTENT;

    const disposition = !isAjaxRequest
      ? FileDispositionHeader.INLINE
      : FileDispositionHeader.ATTACHMENT;

    return res
      .status(statusCode)
      .set(getSendFileHeaders(metadata, disposition, file))
      .send(file);
  }

  // @Delete(':bucketKey/:filename')
  // public destroy(@Param('id') id: string) {
  //   return this.filesService.remove(+id);
  // }
}
