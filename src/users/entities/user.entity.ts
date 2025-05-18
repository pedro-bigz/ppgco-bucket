import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model {
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
