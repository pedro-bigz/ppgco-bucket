import { Injectable, Logger } from '@nestjs/common';
import { moduleTemplate } from '../file-templates';
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
export class ModuleGenerator extends BaseGenerator {
  private controllerClassName: string;
  private controllerPath: string;
  private serviceClassName: string;
  private servicePath: string;
  private providersName: string;
  private providersPath: string;
  private moduleClassName: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.module;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] Module ...');

    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveModulesPath();

    this.controllerClassName = this.nameHelper.resolveControllerClassName();
    this.controllerPath = this.pathHelper.resolveControllerPath();

    this.serviceClassName = this.nameHelper.resolveServiceClassName();
    this.servicePath = this.pathHelper.resolveServicePath();

    this.providersName = this.nameHelper.resolveProvidersName();
    this.providersPath = this.pathHelper.resolveProvidersPath();
    this.moduleClassName = this.nameHelper.resolveModuleClassName();

    return this.setIsForced(isForced).generateFile(moduleTemplate, {
      moduleFilename: this.filename,
      moduleClassName: this.moduleClassName,
      service: {
        path: this.pathHelper.trimTs(this.servicePath),
        className: this.serviceClassName,
      },
      controller: {
        path: this.pathHelper.trimTs(this.controllerPath),
        className: this.controllerClassName,
      },
      providers: {
        path: this.pathHelper.trimTs(this.providersPath),
        name: this.providersName,
      },
    });
  }
}
