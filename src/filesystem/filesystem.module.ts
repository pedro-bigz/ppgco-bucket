import { Logger, Module } from '@nestjs/common';
import { FilesystemService } from './filesystem.service';

@Module({
  providers: [FilesystemService, Logger],
  exports: [FilesystemService],
})
export class FilesystemModule {}
