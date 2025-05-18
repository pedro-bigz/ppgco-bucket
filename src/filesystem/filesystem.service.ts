import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { BUCKET_PATH } from './filesystem.constants';

@Injectable()
export class FilesystemService {
  private rootPath: string;
  private bucketPath: string;
  private loggerPath: string;

  public constructor(private readonly logger: Logger) {
    this.rootPath = path.join(__dirname, '../..');
    this.bucketPath = path.join(this.rootPath, BUCKET_PATH);
  }

  public mkdir(bucketKey: string): boolean {
    const absolutepath = path.join(this.bucketPath, bucketKey);

    if (fs.existsSync(absolutepath)) {
      return false;
    }

    fs.mkdirSync(absolutepath, { recursive: true });
    return true;
  }

  public async put(filepath: string, buffer: Buffer): Promise<boolean> {
    const filename = this.filename(filepath);
    const extname = this.extname(filepath);

    console.log({ filename, extname });

    const basename = filename + extname;
    const absolutepath = this.applyBucketPath(basename);

    console.log({ basename, absolutepath });

    return this.upload(absolutepath, buffer)
      .then(() => true)
      .catch(() => false);
  }

  public async getFromBucket(bucketKey: string, filename: string) {
    return this.get(this.applyBucketPath(bucketKey, filename));
  }

  public resolveLoggerName() {
    return `log-${dayjs().format('YYYY-MM-DDTHH:mm:ss')}`;
  }

  public async get(filepath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const throwOnError = (error: NodeJS.ErrnoException) => {
        if (error) {
          this.logError(error);
          reject(error);
        }
      };
      fs.stat(filepath, function (error, stats) {
        throwOnError(error);

        fs.open(filepath, 'r', function (error, fd) {
          throwOnError(error);

          const buffer = Buffer.alloc(stats.size);
          const readCallback = function (
            error: NodeJS.ErrnoException,
            bytesRead: number,
            buffer: Buffer,
          ) {
            throwOnError(error);
            resolve(buffer);
          };

          fs.read(fd, buffer, 0, buffer.length, null, readCallback);
        });
      });
    });
  }

  public extname(filename: string): string {
    return path.extname(filename);
  }

  public filename(fullname: string): string {
    return fullname.split('.')[0];
  }

  public applyBucketPath(...paths: string[]): string {
    return path.join(this.bucketPath, ...paths);
  }

  public applyLoggerPath(filename: string): string {
    return path.join(this.loggerPath, filename);
  }

  public async upload(path: string, buffer: string | Buffer) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, buffer, (err: NodeJS.ErrnoException | null): void => {
        if (err) {
          this.logError(err);
          reject(err);
        }
        resolve(path);
      });
    });
  }

  public async delete(path: string) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, function (err: any) {
        if (err) {
          this.logError(err);
          reject(err);
        }
        resolve(path);
      });
    });
  }

  public logError(err: NodeJS.ErrnoException) {
    this.logger.error(err);
  }
}
