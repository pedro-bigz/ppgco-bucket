import {
  AfterCreate,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model {
  // @PrimaryKey
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  accessKeyId: string;

  @Column
  secretAccessKey: string;

  @Column
  rememberToken: string;

  @Column
  activated: boolean;

  @Column
  forbidden: boolean;
}
