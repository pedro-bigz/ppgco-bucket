import { paths } from '../crud-generator.constants';
import { PathHelper } from './path.helper';

export class TemplatePathHelper extends PathHelper {
  public static templateRootPath = `${paths.generator.root}/${paths.generator.templates}`;

  public static create() {
    return new this();
  }

  public resolvePath(filename: string) {
    return this.concat(TemplatePathHelper.templateRootPath, filename);
  }
}
