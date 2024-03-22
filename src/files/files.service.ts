import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { generateUUID } from 'utils';
import { FILES_REPOSITORY } from './files.constants';
import { File } from './entities';
import { UploadFileDto } from './dto';
import _omit from 'lodash/omit';
import { Bucket } from 'src/buckets';
import { FilesystemService } from 'src/filesystem';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class FilesService {
  public constructor(
    @Inject(FILES_REPOSITORY)
    private readonly fileModel: typeof File,
    private readonly filesystemService: FilesystemService,
    private readonly sequelize: Sequelize,
  ) {}

  public findOne(bucket: Bucket, path: string) {
    return this.fileModel.findOne({
      where: { path, bucket_id: bucket.id },
    });
  }

  public remove(id: number) {
    return this.fileModel.destroy({ where: { id } });
  }

  public async getFile(bucket: Bucket, filePath: string) {
    const metadata = await this.findOne(bucket, filePath);

    if (!metadata) {
      throw new NotFoundException('File not found');
    }

    const path = bucket.bucket_key + '/' + metadata.path;
    const file = await this.filesystemService.get(path);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return { file, metadata };
  }

  public async uploadFile(
    bucket: Bucket,
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
  ) {
    return this.sequelize.transaction(async (transaction) => {
      const fileRegister = await this.fileModel.create(
        {
          ...uploadFileDto,
          bucket_id: bucket.id,
          path: generateUUID(),
        },
        { transaction },
      );
      const filepath = bucket.bucket_key + '/' + fileRegister.path;
      const status = await this.filesystemService.put(filepath, file.buffer);

      if (!status) {
        throw new InternalServerErrorException('Erro ao armazenar arquivo');
      }

      return _omit(fileRegister, ['id', 'bucket_id']);
    });
  }
}
