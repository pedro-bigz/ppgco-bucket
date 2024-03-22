import { Injectable, Logger } from '@nestjs/common';
import { dtoUpdateTemplate } from '../file-templates';
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
export class DtoUpdateGenerator extends BaseGenerator {
  protected dtoName: string;
  protected schemaName: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.dtoUpdate;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] Dto Update ...');

    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveDtosPath('update');
    this.dtoName = this.nameHelper.resolveDtoName('update');
    this.schemaName = this.nameHelper.resolveSchemaName('update');

    return this.setIsForced(isForced).generateFile(dtoUpdateTemplate, {
      dtoName: this.dtoName,
      schemaName: this.schemaName,
      attributes: this.zodHelper.toSchemaAttributes(
        this.databaseHelper.getAttributes(),
      ),
      imports: this.zodHelper.getImports(),
      setImportString(imports: string[]) {
        return imports.length
          ? `import { ${imports.join(', ')} } from 'utils';`
          : ``;
      },
    });
  }
}
