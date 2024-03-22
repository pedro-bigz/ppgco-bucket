import { Injectable, Logger } from '@nestjs/common';
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
export class ModuleImportGenerator extends BaseGenerator {
  private modulePath: string;
  private modelClassName: string;
  private moduleClassName: string;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {
    super(databaseHelper, fileHelper, shellHelper, templateHelper, zodHelper);
    this.templatePath = paths.templates.model;
  }

  public async generate(tableName: string, isForced: boolean) {
    if (this.hasLog) Logger.debug('[GENERATING] Module Import ...');

    await this.configureModule(tableName);

    this.filename = this.pathHelper.resolveModelsPath();
    this.modulePath = this.pathHelper.getModuleName();
    this.modelClassName = this.nameHelper.resolveModelClassName();
    this.moduleClassName = this.nameHelper.resolveModuleClassName();

    return this.setIsForced(isForced).updateAppModuleFile();
  }

  protected updateAppModuleFile() {
    const generationMarks = {
      imports: `// {IMPORTS} Don't delete me, I'm used for automatic code generation`,
      module: `// {MODULE} Don't delete me, I'm used for automatic code generation`,
      model: `// {MODELS} Don't delete me, I'm used for automatic code generation`,
    };
    const toReplace = {
      imports: `import { ${this.moduleClassName}, ${this.modelClassName} } from './${this.modulePath}';`,
      module: this.moduleClassName + ',',
      model: this.modelClassName + ',',
    };
    const space = String.fromCharCode(0x20);
    const tab = space + space;
    this.fileHelper.replaceContent(paths.app.module, [
      {
        find: generationMarks.imports,
        toReplace: toReplace.imports + '\n' + generationMarks.imports,
      },
      {
        find: generationMarks.module,
        toReplace: toReplace.module + '\n' + tab + tab + generationMarks.module,
      },
      {
        find: generationMarks.model,
        toReplace: toReplace.model + '\n' + tab + tab + generationMarks.model,
      },
    ]);
    return this;
  }
}
