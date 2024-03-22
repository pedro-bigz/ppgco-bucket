import { Injectable, Logger } from '@nestjs/common';
import { constantsTemplate } from '../file-templates';
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
export class ConstantsGenerator extends BaseGenerator {
  private repositoryName: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.constants;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] constants ...');
    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveConstantsPath();
    this.repositoryName = this.nameHelper.resolveRepositoryConstant();

    return this.setIsForced(isForced).generateFile(constantsTemplate, {
      repositoryName: this.repositoryName,
    });
  }
}
