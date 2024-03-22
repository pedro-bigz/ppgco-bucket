import { Injectable } from '@nestjs/common';
import { ColumnDataType, TableColumnDataType } from '../generators/generator';
import _mapValues from 'lodash/mapValues';
import _union from 'lodash/union';

@Injectable()
export class ZodHelper {
  private imports: string[] = [];

  public toSchemaAttributes(attributes: TableColumnDataType) {
    return _mapValues(attributes, this.convertToZod.bind(this));
  }

  public getImports() {
    return this.imports;
  }

  private convertToZod(attribute: ColumnDataType) {
    const getValidation = ({ name, type, isNullable, maxLength }) => {
      if (name.includes('cpf')) {
        return this.getCpfValidation(isNullable);
      }
      if (name.includes('cnpj')) {
        return this.getCnpjValidation(isNullable);
      }
      if (name.includes('cep')) {
        return this.getCepValidation(isNullable);
      }
      if (name.includes('fone') || name.includes('celular')) {
        return this.getTelefoneValidation(isNullable);
      }
      if (type === 'Date') {
        return this.getDateValidation(isNullable);
      }
      if (type === 'number') {
        return this.getNumberValidation(isNullable);
      }
      if (type === 'string') {
        return this.getStringValidation(isNullable, maxLength);
      }

      return this.getStringValidation(isNullable);
    };
    return { ...attribute, validation: getValidation(attribute) };
  }

  private getCpfValidation(isOptional: boolean) {
    this.addImport('lessUnderscore', 'isValidCpf');
    return `z
      .preprocess(lessUnderscore, z.string().refine(isValidCpf, 'CPF'))
      ${isOptional ? `.or(z.literal(''))` : ''}`;
  }

  private getCnpjValidation(isOptional: boolean) {
    this.addImport('lessUnderscore', 'isValidCnpj');
    return `z
      .preprocess(lessUnderscore, z.string().refine(isValidCnpj, 'CNPJ'))
      ${isOptional ? `.or(z.literal(''))` : ''}`;
  }

  private getCepValidation(isOptional: boolean) {
    this.addImport('lessUnderscore');
    return `z
      .preprocess(lessUnderscore, z.string().length(10, 'O CEP deve conter 10 caracteres'))
      ${isOptional ? `.or(z.literal(''))` : ''}`;
  }

  private getTelefoneValidation(isOptional: boolean) {
    this.addImport('lessUnderscore');
    return `z
      .preprocess(lessUnderscore, z.string().min(14, 'Celular incorreto'))
      ${isOptional ? `.or(z.literal(''))` : ''}`;
  }

  private getDateValidation(isOptional: boolean) {
    this.addImport('isValid', 'toIsoString');
    return `z
      .custom(isValid.date, 'Data')
      ${isOptional ? `.or(z.literal(''))` : ''}
      .transform(toIsoString)`;
  }

  private getStringValidation(isOptional: boolean, maxLength?: number) {
    return `z.string()${maxLength ? `.max(${maxLength})` : ''}${
      isOptional ? `.optional()` : ''
    }`;
  }

  private getNumberValidation(isOptional: boolean) {
    return `z.number()${isOptional ? `.optional()` : ''}`;
  }

  private addImport(...packages: string[]) {
    this.imports = _union(this.imports, packages);
  }
}
