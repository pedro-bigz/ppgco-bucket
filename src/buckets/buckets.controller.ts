import {
  Body,
  Query,
  Param,
  Get,
  Patch,
  Post,
  Delete,
  Controller,
} from '@nestjs/common';
import { BucketsService } from './buckets.service';
import {
  CreateBucketsDto,
  UpdateBucketsDto,
  createBucketsSchema,
  updateBucketsSchema,
} from './dto';
import { ZodValidationPipe } from 'core';
import { RequestUser, UserPayload } from 'src/user';

@Controller('buckets')
export class BucketsController {
  public constructor(private readonly bucketsService: BucketsService) {}

  @Post()
  public create(
    @RequestUser() user: UserPayload,
    @Body(new ZodValidationPipe(createBucketsSchema))
    createBucketsDto: CreateBucketsDto,
  ) {
    console.log({ user });
    return this.bucketsService.create(user._id, createBucketsDto);
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateBucketsSchema))
    updateBucketsDto: UpdateBucketsDto,
  ) {
    return this.bucketsService.update(+id, updateBucketsDto);
  }

  // @Delete(':id')
  // public destroy(@Param('id') id: string) {
  //   return this.bucketsService.remove(+id);
  // }
}
