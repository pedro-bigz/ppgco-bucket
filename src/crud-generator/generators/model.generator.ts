import { Injectable, Logger } from '@nestjs/common';
import { modelTemplate } from '../file-templates';
import { BaseGenerator } from './base.generator';
import { paths } from '../crud-generator.constants';
import {
  DatabaseHelper,
  FileHelper,
  TemplateHelper,
  ShellHelper,
  ZodHelper,
} from '../helpers';

@Injectable()
export class ModelGenerator extends BaseGenerator {
  private modelClassName: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.model;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] Model Index ...');

    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveModelsPath();
    this.modelClassName = this.nameHelper.resolveModelClassName();

    return this.setIsForced(isForced).generateFile(modelTemplate, {
      tableName,
      modelClassName: this.modelClassName,
      attributes: Object.values(this.databaseHelper.getAttributes()),
      moduleName: this.pathHelper.getModuleName(),
      hasForeignKeys: this.databaseHelper.hasForeignKeys(),
    });
  }
}
