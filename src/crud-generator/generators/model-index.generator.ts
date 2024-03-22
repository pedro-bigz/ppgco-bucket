import { Injectable, Logger } from '@nestjs/common';
import { BaseGenerator } from './base.generator';
import { paths } from '../crud-generator.constants';
import { modelIndexTemplate } from '../file-templates';
import {
  DatabaseHelper,
  FileHelper,
  TemplateHelper,
  ShellHelper,
  ZodHelper,
} from '../helpers';

@Injectable()
export class ModelIndexGenerator extends BaseGenerator {
  protected dtoName: string;
  protected schemaName: string;
  protected dtoCreatePath: string;
  protected dtoUpdatePath: string;
  protected modelPath: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.modelIndex;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] Model Index ...');

    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveModelIndexPath();
    this.modelPath = this.pathHelper.resolveModelFilename();

    return this.setIsForced(isForced).generateFile(modelIndexTemplate, {
      modelPath: this.pathHelper.trimTs(this.modelPath),
    });
  }
}
