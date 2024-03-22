import { TemplateInterface } from './generator';
import { ModuleNamesHelper, ModulePathHelper } from '../helpers';
import {
  DatabaseHelper,
  FileHelper,
  TemplateHelper,
  ShellHelper,
  ZodHelper,
} from '../helpers';

export abstract class BaseGenerator {
  protected templatePath: string;
  protected filename: string;
  protected nameHelper: ModuleNamesHelper;
  protected moduleName: string;
  protected pathHelper: ModulePathHelper;
  protected hasLog: boolean;

  public constructor(
    protected readonly databaseHelper: DatabaseHelper,
    protected readonly fileHelper: FileHelper,
    protected readonly shellHelper: ShellHelper,
    protected readonly templateHelper: TemplateHelper,
    protected readonly zodHelper: ZodHelper,
  ) {}

  public enableLogs() {
    this.hasLog = true;
    return this;
  }

  public disableLogs() {
    this.hasLog = false;
    return this;
  }

  public setLog(hasLog: boolean) {
    this.hasLog = hasLog;
    return this;
  }

  public setIsForced(force: boolean) {
    this.fileHelper.setIsForced(force);
    return this;
  }

  public getDatabaseService() {
    return this.databaseHelper;
  }

  protected async configureModule(tableName: string, hasDatabase = true) {
    return new Promise((resolve, reject) => {
      this.nameHelper = ModuleNamesHelper.create(tableName);
      this.pathHelper = ModulePathHelper.create(tableName);

      this.moduleName = this.pathHelper.getModuleName();

      if (!hasDatabase) {
        return resolve({});
      }

      this.databaseHelper.getInfo(tableName).then(resolve).catch(reject);
    });
  }

  public abstract generate(tableName: string, isForced: boolean): Promise<this>;

  protected generateFile(template: TemplateInterface, props: object) {
    this.templateHelper.setFileHelper(this.fileHelper);
    this.templateHelper.setContentCompiler(template.getCompiler);

    this.templateHelper.generateFile(
      this.templatePath,
      this.pathHelper.resolveFilePath(this.filename),
      props,
    );

    return this;
  }

  protected generateFolder(folderName?: string) {
    this.fileHelper.generateFolder(
      this.pathHelper.resolveFolderPath(folderName),
    );

    return this;
  }
}
