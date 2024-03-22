import { Injectable } from '@nestjs/common';
import { TypeConstants } from '../crud-generator.constants';
import {
  ColumnDataType,
  ColumnInfoType,
  TableColumnDataType,
} from '../generators/generator';
import _capitalize from 'lodash/capitalize';

@Injectable()
export class TypesHelper {
  private columns: ColumnInfoType[];

  constructor(private tableName: string) {}

  public static create(tableName: string) {
    return new this(tableName);
  }

  public setTableName(tableName: string) {
    this.tableName = tableName;
  }

  public setColumns(columns: ColumnInfoType[]) {
    this.columns = columns;
  }

  public convert(columns: ColumnInfoType[]): TableColumnDataType {
    this.setColumns(columns);
    return Object.fromEntries(this.columns.map(this.convertColumn.bind(this)));
  }

  private convertColumn(column: ColumnInfoType): [string, ColumnDataType] {
    return [column.COLUMN_NAME, this.columnDataResolver(column)];
  }

  private columnDataResolver(column: ColumnInfoType) {
    const name = column.COLUMN_NAME;
    const maxLength = column.CHARACTER_MAXIMUM_LENGTH;
    const type = this.columnTypeResolver(column.DATA_TYPE);
    const isPKey = this.isPKeyColumn(column);
    const isFKey = this.isFKeyColumn(column);
    const isNullable = this.isNullable(column);
    const ordinalPosition = this.getOriginalPosition(column);
    const references = this.getColumnsReference(column, isFKey);

    return {
      name,
      type,
      isPKey,
      isFKey,
      isNullable,
      references,
      maxLength,
      ordinalPosition,
    };
  }

  private columnTypeResolver(dataType: string) {
    const [first] = dataType.split(' ');

    const needle = /[\d,()!\"#$%&'*+,\-./:;<=>?@\[\\\]^_`{|}~]/g;
    const type = first.replace(needle, '');
    const resolved = TypeConstants[type];

    return resolved;
  }

  private isPKeyColumn(columnData: ColumnInfoType) {
    return (
      columnData.COLUMN_NAME === 'id' ||
      columnData.COLUMN_KEY === 'PRI' ||
      columnData.EXTRA === 'auto_increment'
    );
  }

  private isFKeyColumn(columnData: ColumnInfoType) {
    const startsWithId = columnData.COLUMN_NAME.startsWith('id');
    const isPKey = this.isPKeyColumn(columnData);

    return startsWithId && !isPKey;
  }

  private isNullable(columnData: ColumnInfoType) {
    return columnData.IS_NULLABLE.toUpperCase() === 'YES';
  }

  private getOriginalPosition(columnData: ColumnInfoType) {
    return columnData.ORDINAL_POSITION;
  }

  private getColumnsReference(columnData: ColumnInfoType, isFKey: boolean) {
    if (!isFKey) return undefined;

    const columnName = columnData.COLUMN_NAME;
    const reference = columnName.substring(2, columnName.length);

    return _capitalize(reference);
  }
}
