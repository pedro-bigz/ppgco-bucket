import {
  Body,
  Query,
  Param,
  Get,
  Patch,
  Post,
  Delete,
  Controller,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ZodValidationPipe } from 'core';
import { Public } from 'src/auth';
import { UploadFileDto, uploadFileSchema } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BucketsService } from 'src/buckets';
import { RequestUser, UserPayload } from 'src/user';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly bucketsService: BucketsService,
  ) {}

  @Public()
  @Post('upload/:bucketKey')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('bucketKey') bucketKey: string,
    @RequestUser() user: UserPayload,
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(uploadFileSchema))
    uploadFileDto: UploadFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    console.log({
      file,
    });

    const bucket = await this.bucketsService.findOne(bucketKey);
    const hasAccess = this.bucketsService.canAccess(user, bucket);

    if (!hasAccess) {
      throw new UnauthorizedException('Unauthorized action');
    }

    return this.filesService.uploadFile(bucket, file, uploadFileDto);
  }

  @Public()
  @Get('path/:bucketKey')
  async getFile(
    @RequestUser() user: UserPayload,
    @Param('bucketKey') bucketKey: string,
    @Query('filename') filePath: string,
  ) {
    const bucket = await this.bucketsService.findOne(bucketKey);
    const hasAccess = this.bucketsService.canAccess(user, bucket);

    if (!hasAccess) {
      throw new UnauthorizedException('Unauthorized action');
    }

    return this.filesService.getFile(bucket, filePath);
  }

  // @Delete(':id')
  // public destroy(@Param('id') id: string) {
  //   return this.filesService.remove(+id);
  // }
}
