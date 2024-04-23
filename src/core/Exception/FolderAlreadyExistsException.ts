import { FileSystemException } from './FileSystemException';

export class FolderAlreadyExistsException extends FileSystemException {
  private filename: string;

  constructor(filename: string) {
    super(`The folder ${filename} already exists`);
    this.filename = filename;
  }

  public getFilename() {
    return this.filename;
  }
}
