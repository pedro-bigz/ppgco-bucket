import { ApiHideProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Bucket } from 'src/buckets';

@Table({ tableName: 'files' })
export class File extends Model {
  @ApiHideProperty()
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  password: string;

  @Column
  description: string;

  @Column
  mimeType: string;

  @Column
  extension: string;

  @Column
  path: string;

  @Column
  @ForeignKey(() => Bucket)
  bucketKey: string;

  @BelongsTo(() => Bucket)
  bucket: Bucket;
}
