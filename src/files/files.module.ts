import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { filesProviders } from './files.providers';
import { BucketsModule } from 'src/buckets';
import { FilesystemModule } from 'src/filesystem';

@Module({
  imports: [BucketsModule, FilesystemModule],
  controllers: [FilesController],
  providers: [FilesService, ...filesProviders],
})
export class FilesModule {}
