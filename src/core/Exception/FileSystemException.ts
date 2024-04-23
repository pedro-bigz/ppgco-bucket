import { Logger } from '@nestjs/common';
import { CustomError } from './CustomError';

export class FileSystemException extends CustomError {
  constructor(message: string) {
    super(message);
  }

  public log() {
    Logger.error('[ALREADY EXISTS] ' + this.message);
  }
}
