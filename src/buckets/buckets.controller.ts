import { Body, Param, Patch, Post, Controller } from '@nestjs/common';
import { BucketsService } from './buckets.service';
import {
  CreateBucketsDto,
  UpdateBucketsDto,
  createBucketsSchema,
  updateBucketsSchema,
} from './dto';
import { ZodValidationPipe } from 'src/core';
import { RequestUser, User } from 'src/users';

@Controller('buckets')
export class BucketsController {
  public constructor(private readonly bucketsService: BucketsService) {}

  @Post()
  public create(
    @RequestUser() user: User,
    @Body(new ZodValidationPipe(createBucketsSchema))
    createBucketsDto: CreateBucketsDto,
  ) {
    console.log('buckets.create');
    return this.bucketsService.create(user.id, createBucketsDto);
  }

  @Patch(':bucketKey')
  public update(
    @RequestUser() user: User,
    @Param('bucketKey') bucketKey: string,
    @Body(new ZodValidationPipe(updateBucketsSchema))
    updateBucketsDto: UpdateBucketsDto,
  ) {
    return this.bucketsService.update(bucketKey, user, updateBucketsDto);
  }

  // @Delete(':id')
  // public destroy(@Param('id') id: string) {
  //   return this.bucketsService.remove(+id);
  // }
}
