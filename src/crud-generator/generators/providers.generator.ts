import { Injectable, Logger } from '@nestjs/common';
import { providersTemplate } from '../file-templates';
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
export class ProvidersGenerator extends BaseGenerator {
  private providerName: string;
  private modelClassName: string;
  private constantsPath: string;
  private modelRepository: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.providers;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] Providers ...');

    await this.configureModule(tableName);

    this.providerName = this.nameHelper.resolveProvidersName();
    this.modelClassName = this.nameHelper.resolveModelClassName();
    this.modelRepository = this.nameHelper.resolveRepositoryConstant();

    this.filename = this.pathHelper.resolveProvidersPath();
    this.constantsPath = this.pathHelper.resolveConstantsPath();

    return this.setIsForced(isForced).generateFile(providersTemplate, {
      providerName: this.providerName,
      modelClassName: this.modelClassName,
      constants: {
        repository: this.modelRepository,
        path: this.pathHelper.trimTs(this.constantsPath),
      },
    });
  }
}
