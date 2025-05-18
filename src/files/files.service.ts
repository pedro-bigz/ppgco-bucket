import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { generateUUID } from 'src/utils';
import { FILES_REPOSITORY } from './files.constants';
import { File } from './entities';
import { UploadFileDto } from './dto';
import _omit from 'lodash/omit';
import { Bucket } from 'src/buckets';
import { FilesystemService } from 'src/filesystem';
import { Sequelize } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import path from 'path';

@Injectable()
export class FilesService {
  public constructor(
    @Inject(FILES_REPOSITORY)
    private readonly fileModel: typeof File,
    private readonly filesystemService: FilesystemService,
    private readonly sequelize: Sequelize,
  ) {}

  public findOne(bucketKey: string, path: string) {
    return this.fileModel.findOne({
      where: { path, bucketKey },
    });
  }

  public remove(id: number) {
    return this.fileModel.destroy({ where: { id } });
  }

  public async getFile(bucket: Bucket, filePath: string, password?: string) {
    const metadata = await this.findOne(bucket.bucketKey, filePath);

    if (!metadata) {
      throw new NotFoundException('File not found');
    }

    console.log({ metadata });

    if (
      metadata.password &&
      !password &&
      !bcrypt.compareSync(password, metadata.password)
    ) {
      throw new ForbiddenException('Fordibben File');
    }

    const file = await this.filesystemService.getFromBucket(
      bucket.bucketKey,
      metadata.path,
    );

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
    const metadata = {
      path: uploadFileDto.filename,
      name: file.originalname,
      extension: path.extname(file.originalname),
    };

    return this.sequelize.transaction(async (transaction) => {
      const fileRegister = await this.fileModel.create(
        {
          ...uploadFileDto,
          ...metadata,
          bucketKey: bucket.bucketKey,
          mimeType: file.mimetype,
          name: metadata.name.replace(metadata.extension, ''),
          password: uploadFileDto.password
            ? bcrypt.hashSync(uploadFileDto.password, 10)
            : null,
        },
        { transaction },
      );

      console.log({
        path: path.join(bucket.bucketKey, fileRegister.path),
      });

      const filepath = path.join(bucket.bucketKey, fileRegister.path);
      const status = await this.filesystemService.put(filepath, file.buffer);

      if (!status) {
        throw new InternalServerErrorException('Erro ao armazenar arquivo');
      }

      return _omit(fileRegister.dataValues, ['id', 'password', 'bucketId']);
    });
  }
}
