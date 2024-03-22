import { Injectable, Logger } from '@nestjs/common';
import { serviceSpecTemplate } from '../file-templates';
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
export class ServiceSpecGenerator extends BaseGenerator {
  private serviceClassName: string;
  private servicePath: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.serviceSpec;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] Service spec ...');

    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveServiceSpecPath();
    this.serviceClassName = this.nameHelper.resolveServiceClassName();
    this.servicePath = this.pathHelper.resolveServicePath();

    return this.setIsForced(isForced).generateFile(serviceSpecTemplate, {
      serviceClassName: this.serviceClassName,
      servicePath: this.pathHelper.trimTs(this.servicePath),
    });
  }
}
