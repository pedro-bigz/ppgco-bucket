import { Module } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiKeyFormatter } from './api-key.formatter';
import { ApiHeadersService } from './api-headers.service';

@Module({
  providers: [ApiKeyService, ApiKeyFormatter, ApiHeadersService],
  exports: [ApiKeyService, ApiKeyFormatter, ApiHeadersService],
})
export class ApiKeyModule {}
