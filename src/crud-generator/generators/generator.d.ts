export interface ColumnInfoType {
  COLUMN_NAME: string;
  COLUMN_KEY: string;
  DATA_TYPE: string;
  UDT_NAME: string;
  COLUMN_DEFAULT: string;
  IS_NULLABLE: string;
  CHARACTER_MAXIMUM_LENGTH: number;
  ORDINAL_POSITION: number;
  EXTRA: string;
}

export interface ColumnDataType {
  defaultValue?: any;
  name: string;
  type: string;
  isPKey?: boolean;
  isFKey?: boolean;
  isNullable: boolean;
  references?: string;
  maxLength: number;
  ordinalPosition: number;
}

export type TableColumnDataType = Record<string, ColumnDataType>;

export interface GenerateServiceInterface {
  generate: (tableName: string, isForced: boolean) => void;
}

export interface TemplateInterface {
  getCompiler: (props: object) => string;
}
