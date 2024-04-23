import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

import { TypesHelper } from './types.helper';
import { ColumnInfoType, TableColumnDataType } from '../generators/generator';

@Injectable()
export class QueryHelper {
  private static instance: QueryHelper;
  private static query: string = `
    SELECT * FROM information_schema.columns
    WHERE table_schema = :schema AND TABLE_NAME = :name
  `;
  private attributes: TableColumnDataType;

  private constructor(
    private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
  ) {}

  public static singleton(sequelize: Sequelize, configService: ConfigService) {
    if (!this.instance) {
      this.instance = new this(sequelize, configService);
    }

    return this.instance;
  }

  public async getInfo(name: string): Promise<TableColumnDataType> {
    const [result] = await this.sequelize.query(QueryHelper.query, {
      replacements: {
        name,
        schema: this.configService.get('DB_DATABASE'),
      },
    });

    this.attributes = TypesHelper.create(name).convert(
      result as ColumnInfoType[],
    );

    return this.attributes;
  }

  public getAttributes() {
    return this.attributes;
  }
}
