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
  isPrivate: boolean;

  @Column
  bucketKey: string;

  @Column
  @ForeignKey(() => User)
  ownerId: number;

  @BelongsTo(() => User)
  owner: User;
}
