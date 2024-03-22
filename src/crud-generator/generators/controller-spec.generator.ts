import { Injectable, Logger } from '@nestjs/common';
import { controllerSpecTemplate } from '../file-templates';
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
export class ControllerSpecGenerator extends BaseGenerator {
  private controllerClassName: string;
  private serviceClassName: string;
  private controllerPath: string;
  private servicePath: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.controllerSpec;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] controller spec ...');

    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveControllerSpecPath();
    this.controllerClassName = this.nameHelper.resolveControllerClassName();
    this.controllerPath = this.pathHelper.resolveControllerPath();

    this.serviceClassName = this.nameHelper.resolveServiceClassName();
    this.servicePath = this.pathHelper.resolveServicePath();

    return this.setIsForced(isForced).generateFile(controllerSpecTemplate, {
      controllerClassName: this.controllerClassName,
      serviceClassName: this.serviceClassName,
      controllerPath: this.pathHelper.trimTs(this.controllerPath),
      servicePath: this.pathHelper.trimTs(this.servicePath),
    });
  }
}
