import { FileSystemException } from './FileSystemException';

export class NotFoundException extends FileSystemException {
  private filename: string;

  constructor(filename: string) {
    super(`The file or folder ${filename} was not found`);
    this.filename = filename;
  }

  public getFilename() {
    return this.filename;
  }
}
