import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users';

@Table({ tableName: 'buckets' })
export class Bucket extends Model {
  @Column({ primaryKey: true, autoIncrement: false })
  bucketKey: string;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  active: boolean;

  @Column
  isPrivate: boolean;

  @Column
  @ForeignKey(() => User)
  ownerId: number;

  @BelongsTo(() => User)
  owner: User;
}
