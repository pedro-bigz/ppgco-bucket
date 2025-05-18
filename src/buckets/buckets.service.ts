import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import _omit from 'lodash/omit';

import { generateUUID } from 'src/utils';
import { User } from 'src/users';
import { FilesystemService } from 'src/filesystem';
import { BUCKETS_REPOSITORY } from './buckets.constants';
import { Bucket } from './entities';
import { CreateBucketsDto, UpdateBucketsDto } from './dto';

@Injectable()
export class BucketsService {
  public constructor(
    @Inject(BUCKETS_REPOSITORY)
    private readonly bucketModel: typeof Bucket,
    private readonly sequelize: Sequelize,
    private readonly filesystemService: FilesystemService,
  ) {}

  public findOne(bucketKey: string) {
    return this.bucketModel.findOne({
      where: { bucketKey },
    });
  }

  public create(userId: number, createBucketsDto: CreateBucketsDto) {
    return this.sequelize.transaction(async (transaction) => {
      const { isPrivate, ...bucketDto } = createBucketsDto;
      const bucket = await this.bucketModel.create(
        {
          ...bucketDto,
          bucketKey: generateUUID(),
          isPrivate: isPrivate,
          ownerId: userId,
        },
        { transaction },
      );

      const status = this.filesystemService.mkdir(bucket.bucketKey);

      if (!status) {
        throw new InternalServerErrorException('Error creating bucket');
      }

      return _omit(bucket.dataValues, ['id', 'ownerId']);
    });
  }

  public async update(
    bucketKey: string,
    user: User,
    updateBucketsDto: UpdateBucketsDto,
  ) {
    const bucket = await this.findOne(bucketKey);
    const canEdit = this.canAccess(user, bucket.dataValues);

    if (!canEdit) {
      throw new UnauthorizedException('Unauthorized action');
    }

    return this.bucketModel.update(updateBucketsDto, {
      where: { id: bucket.dataValues.id },
    });
  }

  public remove(id: number) {
    return this.bucketModel.destroy({ where: { id } });
  }

  public canAccess(user: User | undefined, bucket: Bucket) {
    return bucket.ownerId === user?.id || !bucket.isPrivate;
  }
}
