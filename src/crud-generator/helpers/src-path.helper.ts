import { paths } from '../crud-generator.constants';
import { PathHelper } from './path.helper';

export class SrcPathHelper extends PathHelper {
  private static rootPath = paths.app.root;

  public static create() {
    return new this();
  }

  public resolvePath(filename: string) {
    return this.concat(SrcPathHelper.rootPath, filename);
  }
}
