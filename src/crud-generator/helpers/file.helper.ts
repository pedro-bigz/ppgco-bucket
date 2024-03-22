import fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import {
  NotFoundException,
  FileSystemException,
  FileAlreadyExistsException,
  FolderAlreadyExistsException,
} from 'core/Exception';
import { SrcPathHelper } from '.';
import { convertTabsInSpaces } from 'utils';

export type FileReplaceContentType = {
  find: string;
  toReplace: string;
};

@Injectable()
export class FileHelper {
  private force: boolean;
  private path: string;
  private srcPathHelper: SrcPathHelper;

  public constructor() {
    this.srcPathHelper = SrcPathHelper.create();
  }

  public setIsForced(force: boolean) {
    this.force = force;
  }

  public isForced() {
    return this.force;
  }

  public setPath(path: string) {
    this.path = path;
  }

  public getPath() {
    return this.path;
  }

  public generateFile(path: string, template: string) {
    try {
      this.setPath(this.srcPathHelper.resolvePath(path));

      if (this.fileExists(this.path)) {
        if (!this.isForced()) {
          throw new FileAlreadyExistsException(this.path);
        }

        Logger.warn('[ALREADY EXISTS] ' + this.path);
        this.deleteFile(this.path);
      }

      this.writeFile(this.path, template);
      Logger.log('[GENERATED] ' + this.path);
    } catch (e) {
      if (e instanceof FileSystemException) {
        return e.log();
      }

      Logger.error(e.message);
    }
  }

  public generateFolder(path: string) {
    try {
      this.setPath(this.srcPathHelper.resolvePath(path));

      if (this.fileExists(this.path)) {
        if (!this.isForced()) {
          throw new FolderAlreadyExistsException(this.path);
        }

        Logger.warn('[ALREADY EXISTS] ' + this.path);
        this.deleteFolder(this.path);
      }

      this.makeFolder(this.path);
      Logger.log('[CREATED] ' + this.path);
    } catch (e) {
      if (e instanceof FileSystemException) {
        return e.log();
      }

      Logger.error(e.message);
    }
  }

  private writeFile(path: string, content: string) {
    try {
      return fs.writeFileSync(path, content);
    } catch (e) {
      return null;
    }
  }

  private makeFolder(path: string) {
    return fs.mkdirSync(path);
  }

  private fileExists(path: string) {
    try {
      return fs.existsSync(path);
    } catch (e) {
      return null;
    }
  }

  private canDelete(path: string) {
    return this.fileExists(path) && this.isForced();
  }

  private deleteFile(path: string) {
    try {
      if (!this.canDelete(path)) {
        throw new FileAlreadyExistsException(path);
      }

      return fs.unlinkSync(path);
    } catch (e) {
      return null;
    }
  }

  private deleteFolder(path: string) {
    try {
      if (!this.canDelete(path)) {
        throw new NotFoundException(path);
      }

      return fs.rmSync(path, { recursive: true, force: this.isForced() });
    } catch (e) {
      return null;
    }
  }

  public getFileContent(path: string) {
    return fs.readFileSync(path).toString();
  }

  public replaceContent(path: string, toReplace: FileReplaceContentType[]) {
    this.setPath(this.srcPathHelper.resolvePath(path));

    const content = this.getFileContent(this.path);

    const newContent = toReplace.reduce((accumuled, item) => {
      return accumuled.replace(item.find, convertTabsInSpaces(item.toReplace));
    }, content);

    this.writeFile(this.path, newContent);
    Logger.log('[UPDATED] ' + this.path);

    return true;
  }
}
