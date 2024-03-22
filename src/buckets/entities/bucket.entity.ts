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
import { User } from 'src/user';

@Table({ tableName: 'buckets' })
export class Bucket extends Model {
  @ApiHideProperty()
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  active: boolean;

  @Column
  is_private: boolean;

  @Column
  bucket_key: string;

  @Column
  @ForeignKey(() => User)
  owner_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => User)
  owner: User;
}
