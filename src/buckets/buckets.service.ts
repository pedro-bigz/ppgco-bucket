import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BUCKETS_REPOSITORY } from './buckets.constants';
import { Bucket } from './entities';
import { CreateBucketsDto, UpdateBucketsDto } from './dto';
import { AppListing, Query } from 'core';
import { generateUUID } from 'utils';
import { FilesystemService } from 'src/filesystem';
import _omit from 'lodash/omit';
import { UserPayload } from 'src/user';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class BucketsService {
  public constructor(
    @Inject(BUCKETS_REPOSITORY)
    private readonly bucketModel: typeof Bucket,
    private readonly sequelize: Sequelize,
    private readonly filesystemService: FilesystemService,
  ) {}

  // public findOne(id: number) {
  //   return this.bucketModel.findOne({ where: { id } });
  // }

  public findOne(bucketKey: string) {
    return this.bucketModel.findOne({
      where: { bucket_key: bucketKey },
    });
  }

  public create(userId: number, createBucketsDto: CreateBucketsDto) {
    return this.sequelize.transaction(async (transaction) => {
      const bucket = await this.bucketModel.create(
        {
          ...createBucketsDto,
          bucket_key: generateUUID(),
          owner_id: userId,
        },
        { transaction },
      );

      const status = this.filesystemService.mkdir(bucket.bucket_key);

      if (!status) {
        throw new InternalServerErrorException('Error creating bucket');
      }

      return _omit(bucket, ['id', 'owner_id']);
    });
  }

  public update(id: number, updateBucketsDto: UpdateBucketsDto) {
    return this.bucketModel.update(updateBucketsDto, { where: { id } });
  }

  public remove(id: number) {
    return this.bucketModel.destroy({ where: { id } });
  }

  public canAccess(user: UserPayload, bucket: Bucket) {
    return bucket.owner_id === user._id || !bucket.is_private;
  }
}
