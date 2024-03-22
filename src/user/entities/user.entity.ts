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
  first_name: string;

  @Column
  last_name: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  remember_token: string;

  @Column
  email_verified_at: Date;

  @Column
  activated: boolean;

  @Column
  language: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @AfterCreate
  static sendVerificationEmail(instance: User) {
    console.log(instance);
  }
}
