import { ApiHideProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
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
  description: string;

  @Column
  path: string;

  @Column
  @ForeignKey(() => Bucket)
  bucket_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => Bucket)
  bucket: Bucket;
}
