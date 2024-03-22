import { Injectable, Logger } from '@nestjs/common';
import { BaseGenerator } from './base.generator';
import { paths } from '../crud-generator.constants';
import { moduleIndexTemplate } from '../file-templates';
import {
  DatabaseHelper,
  FileHelper,
  TemplateHelper,
  ShellHelper,
  ZodHelper,
} from '../helpers';

@Injectable()
export class ModuleIndexGenerator extends BaseGenerator {
  protected dtoName: string;
  protected schemaName: string;
  protected dtoCreatePath: string;
  protected dtoUpdatePath: string;
  protected modulePath: string;
  protected controllerPath: string;
  protected servicePath: string;
  protected constantsPath: string;
  protected providersPath: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.moduleIndex;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] Module Index ...');

    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveModuleIndexPath();
    this.modulePath = this.pathHelper.resolveModulesPath();
    this.servicePath = this.pathHelper.resolveServicePath();
    this.constantsPath = this.pathHelper.resolveConstantsPath();
    this.providersPath = this.pathHelper.resolveProvidersPath();
    this.controllerPath = this.pathHelper.resolveControllerPath();

    return this.setIsForced(isForced)
      .generateFolder()
      .generateFile(moduleIndexTemplate, {
        modulePath: this.pathHelper.trimTs(this.modulePath),
        controllerPath: this.pathHelper.trimTs(this.controllerPath),
        servicePath: this.pathHelper.trimTs(this.servicePath),
        constantsPath: this.pathHelper.trimTs(this.constantsPath),
        providersPath: this.pathHelper.trimTs(this.providersPath),
      });
  }
}
