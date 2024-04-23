import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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

  public findOne(bucket: Bucket, path: string, extension: string) {
    return this.fileModel.findOne({
      where: { path, bucketId: bucket.id },
    });
  }

  public remove(id: number) {
    return this.fileModel.destroy({ where: { id } });
  }

  public async getFile(bucket: Bucket, filePath: string, password?: string) {
    const filename = this.filesystemService.filename(filePath);
    const extname = this.filesystemService.extname(filePath);
    const metadata = await this.findOne(bucket, filename, extname);

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
      metadata.path + metadata.extension,
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
      path: generateUUID(),
      extension: path.extname(file.originalname),
      name: path.normalize(file.originalname),
    };

    return this.sequelize.transaction(async (transaction) => {
      const fileRegister = await this.fileModel.create(
        {
          ...uploadFileDto,
          ...metadata,
          bucketId: bucket.id,
          mimeType: file.mimetype,
          name: metadata.name.replace(metadata.extension, ''),
          password: uploadFileDto.password
            ? bcrypt.hashSync(uploadFileDto.password, 10)
            : null,
        },
        { transaction },
      );

      const filepath =
        bucket.bucketKey + '/' + fileRegister.path + metadata.extension;
      const status = await this.filesystemService.put(filepath, file.buffer);

      if (!status) {
        throw new InternalServerErrorException('Erro ao armazenar arquivo');
      }

      return _omit(fileRegister.dataValues, ['id', 'password', 'bucketId']);
    });
  }
}
