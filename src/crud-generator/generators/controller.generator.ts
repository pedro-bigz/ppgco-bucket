import { Injectable, Logger } from '@nestjs/common';

import * as _ from 'lodash';

import { controllerTemplate } from '../file-templates';
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
export class ControllerGenerator extends BaseGenerator {
  private controllerClassName: string;
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
    this.templatePath = paths.templates.controller;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] controller ...');

    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveControllerPath();
    this.controllerClassName = this.nameHelper.resolveControllerClassName();
    this.serviceClassName = this.nameHelper.resolveServiceClassName();
    this.servicePath = this.pathHelper.resolveServicePath();

    const { create: createSchema, update: updateSchema } =
      this.nameHelper.resolveSchemaNames();

    const { create: createDto, update: updateDto } =
      this.nameHelper.resolveDtoNames();

    return this.setIsForced(isForced).generateFile(controllerTemplate, {
      routePreffix: this.pathHelper.getModuleName(),
      controllerFilename: this.filename,
      controllerClassName: this.controllerClassName,
      service: {
        name: _.lowerFirst(this.serviceClassName),
        path: this.pathHelper.trimTs(this.servicePath),
        className: this.serviceClassName,
      },
      dto: {
        create: {
          name: _.lowerFirst(createDto),
          type: createDto,
        },
        update: {
          name: _.lowerFirst(updateDto),
          type: updateDto,
        },
      },
      schema: {
        create: createSchema,
        update: updateSchema,
      },
    });
  }
}
