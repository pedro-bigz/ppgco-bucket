import { Injectable } from '@nestjs/common';
import { FileHelper } from './file.helper';
import { SrcPathHelper, TemplatePathHelper } from '.';
import _ from 'lodash'

@Injectable()
export class TemplateHelper {
  protected templatePath: string;
  protected modulePath: any;
  protected fileHelper: FileHelper;
  protected srcPathHelper: SrcPathHelper;
  protected templatePathHelper: TemplatePathHelper;

  public constructor() {
    this.srcPathHelper = SrcPathHelper.create();
    this.templatePathHelper = TemplatePathHelper.create();
  }

  private contentCompiler: (...args: any[]) => string;

  public setContentCompiler(contentCompiler: (...args: any[]) => string) {
    this.contentCompiler = contentCompiler;
    return this;
  }

  public setFileHelper(fileHelper: FileHelper) {
    this.fileHelper = fileHelper;
    return this;
  }

  public getTemplatePath() {
    return this.templatePath;
  }

  public getModulePath() {
    return this.modulePath;
  }

  public generateFile(template: string, filePath: string, props?: object) {
    this.templatePath = this.templatePathHelper.resolvePath(template);
    this.fileHelper.generateFile(filePath, this.contentCompiler(props));
  }

  public generateFolder(folderName: string) {
    this.fileHelper.generateFolder(folderName);
  }
}
