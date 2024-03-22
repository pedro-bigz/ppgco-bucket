import { Injectable } from '@nestjs/common';
import { BaseGenerator } from './base.generator';
import { paths } from '../crud-generator.constants';
import { dtoIndexTemplate } from '../file-templates';
import {
  DatabaseHelper,
  FileHelper,
  TemplateHelper,
  ShellHelper,
  ZodHelper,
} from '../helpers';

@Injectable()
export class DtoIndexGenerator extends BaseGenerator {
  protected dtoName: string;
  protected schemaName: string;
  protected dtoCreatePath: string;
  protected dtoUpdatePath: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.dtoIndex;
  }

  public async generate(tableName: string, isForced: boolean) {
    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveDtoIndexPath();
    this.dtoCreatePath = this.pathHelper.resolveDtoFilename('create');
    this.dtoUpdatePath = this.pathHelper.resolveDtoFilename('update');

    return this.setIsForced(isForced).generateFile(dtoIndexTemplate, {
      dtoCreatePath: this.pathHelper.trimTs(this.dtoCreatePath),
      dtoUpdatePath: this.pathHelper.trimTs(this.dtoUpdatePath),
    });
  }
}
