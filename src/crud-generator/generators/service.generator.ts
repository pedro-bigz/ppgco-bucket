import { Injectable, Logger } from '@nestjs/common';
// import _lowerFirst from 'lodash/lowerFirst';
import * as _ from 'lodash';

import { serviceTemplate } from '../file-templates';
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
export class ServiceGenerator extends BaseGenerator {
  private serviceClassName: string;
  private modelClassName: string;
  private modelRepository: string;
  private constantsPath: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.service;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] Service ...');

    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveServicePath();
    this.constantsPath = this.pathHelper.resolveConstantsPath();

    this.serviceClassName = this.nameHelper.resolveServiceClassName();
    this.modelClassName = this.nameHelper.resolveModelClassName();
    this.modelRepository = this.nameHelper.resolveRepositoryConstant();

    const { create: createDto, update: updateDto } =
      this.nameHelper.resolveDtoNames();

    return this.setIsForced(isForced).generateFile(serviceTemplate, {
      constantsPath: this.pathHelper.trimTs(this.constantsPath),
      serviceFilename: this.filename,
      serviceClassName: this.serviceClassName,
      primaryKey: this.databaseHelper.findPrimaryKey(),
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
      model: {
        repository: this.modelRepository,
        name: _.lowerFirst(this.modelClassName) + 'Model',
        type: this.modelClassName,
      },
    });
  }
}
