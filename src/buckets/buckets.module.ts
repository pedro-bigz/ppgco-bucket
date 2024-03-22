import { Module } from '@nestjs/common';
import { BucketsService } from './buckets.service';
import { BucketsController } from './buckets.controller';
import { bucketsProviders } from './buckets.providers';
import { FilesystemModule } from 'src/filesystem';

@Module({
  imports: [FilesystemModule],
  controllers: [BucketsController],
  providers: [BucketsService, ...bucketsProviders],
  exports: [BucketsService],
})
export class BucketsModule {}
