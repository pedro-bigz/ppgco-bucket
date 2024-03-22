import * as path from 'path';
import * as _ from 'lodash';
// import _kebabCase from 'lodash/kebabCase';
// import _trimEnd from 'lodash/trimEnd';
// import _trim from 'lodash/trim';
// import _get from 'lodash/get';

import { ExtensionType, paths as constants } from '../crud-generator.constants';

export class PathHelper {
  public concat(...args: string[]) {
    return path.normalize(path.join(...args));
  }

  public trimSlash(arg: string) {
    return _.trim(arg, constants.separator);
  }

  public resolveFileName(filename: string, extname?: ExtensionType) {
    return filename + constants.extension[extname ?? 'index'];
  }

  public getSrcFolder(...subpath: string[]) {
    return _.get(constants.app.subfolders, subpath, constants.app.subfolders);
  }

  public getSingular(word: string) {
    return _.trimEnd(word, 's');
  }

  public getPlural(word: string) {
    return this.getSingular(word) + 's';
  }

  public toNestPathFormat(path: string) {
    return _.kebabCase(path);
  }
}
