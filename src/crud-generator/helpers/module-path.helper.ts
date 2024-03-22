import { PathHelper } from './path.helper';

export class ModulePathHelper extends PathHelper {
  private resolvedBaseName: string;
  private originalPath: string;

  public constructor(originalPath: string) {
    super();

    this.originalPath = originalPath;
    this.resolvedBaseName = this.resolveMainPath();
  }

  public static create(originalPath: string) {
    return new this(originalPath);
  }

  public resolveMainPath() {
    return this.toNestPathFormat(this.originalPath);
  }

  public setModulePath(resolvedBaseName: string) {
    this.resolvedBaseName = resolvedBaseName;
  }

  public getModuleName() {
    return this.resolvedBaseName ?? this.resolveMainPath();
  }

  public resolveProvidersPath() {
    return this.resolveFileName(this.getModuleName(), 'providers');
  }

  public resolveControllerPath() {
    return this.resolveFileName(this.getModuleName(), 'controller');
  }

  public resolveControllerSpecPath() {
    return this.resolveFileName(this.getModuleName(), 'controllerSpec');
  }

  public resolveServicePath() {
    return this.resolveFileName(this.getModuleName(), 'service');
  }

  public resolveServiceSpecPath() {
    return this.resolveFileName(this.getModuleName(), 'serviceSpec');
  }

  public resolveConstantsPath() {
    return this.resolveFileName(this.getModuleName(), 'constants');
  }

  public resolveModulesPath() {
    return this.resolveFileName(this.getModuleName(), 'module');
  }

  public resolveModelsPath() {
    const path = this.concat(
      this.getSrcFolder('models'),
      this.resolveModelFilename(),
    );

    return path;
  }

  public resolveModelFilename() {
    const path = this.getSingular(this.getModuleName());
    return this.resolveFileName(path, 'model');
  }

  public resolveDtosPath(preffix: 'create' | 'update') {
    const path = this.concat(
      this.getSrcFolder('dto'),
      this.resolveDtoFilename(preffix),
    );

    return path;
  }

  public resolveDtoFilename(preffix: 'create' | 'update') {
    const radical = this.getSingular(this.getModuleName());
    const filename = this.resolveFileName(preffix + '-' + radical, 'dto');

    return filename;
  }

  public resolveDtoIndexPath() {
    return this.concat(this.getSrcFolder('dto'), this.resolveFileName('index'));
  }

  public resolveModelIndexPath() {
    return this.concat(
      this.getSrcFolder('models'),
      this.resolveFileName('index'),
    );
  }

  public resolveModuleIndexPath() {
    return this.resolveFileName('index');
  }

  public resolveFilePath(filename: string) {
    return this.concat(this.getModuleName(), filename);
  }

  public resolveFolderPath(folderName?: string) {
    const folderPath = folderName
      ? this.concat(this.getModuleName(), folderName)
      : this.getModuleName();

    return folderPath;
  }

  public trimTs(filename: string) {
    return filename.replace(/(\.ts)(?!.*\1)/, '');
  }
}
