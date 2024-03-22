import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

import _some from 'lodash/some';
import _find from 'lodash/find';

import { TableColumnDataType } from '../generators/generator';
import { QueryHelper } from './query.helper';

@Injectable()
export class DatabaseHelper {
  private queryHelper: QueryHelper;

  public constructor(
    private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
  ) {
    this.queryHelper = QueryHelper.singleton(
      this.sequelize,
      this.configService,
    );
  }

  public getInfo(name: string): Promise<TableColumnDataType> {
    if (this.getAttributes()) {
      return Promise.resolve(this.getAttributes());
    }

    return this.queryHelper.getInfo(name);
  }

  public getAttributes() {
    return this.queryHelper.getAttributes();
  }

  public hasForeignKeys() {
    return _some(this.getAttributes(), 'isFKey');
  }

  public findPrimaryKey() {
    return _find(this.getAttributes(), 'isPKey');
  }
}
