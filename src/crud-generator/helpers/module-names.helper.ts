// import _kebabCase from 'lodash/kebabCase';
// import _upperFirst from 'lodash/upperFirst';
// import _camelCase from 'lodash/camelCase';
// import _trimEnd from 'lodash/trimEnd';
import * as _ from 'lodash';

export class ModuleNamesHelper {
  private originalName: string;

  public constructor(originalName: string) {
    this.originalName = originalName;
  }

  public static create(originalName: string) {
    return new this(originalName);
  }

  public resolveClassName() {
    return _.upperFirst(_.camelCase(this.originalName));
  }

  public resolveRepositoryConstant() {
    return this.originalName.toUpperCase() + '_REPOSITORY';
  }

  public resolveModuleName() {
    return _.kebabCase(this.originalName);
  }

  public resolveModelClassName() {
    return _.trimEnd(this.resolveClassName(), 's');
  }

  public resolveProvidersName() {
    return _.camelCase(this.originalName) + 'Providers';
  }

  public resolveControllerClassName() {
    return this.resolveClassName() + 'Controller';
  }

  public resolveModuleClassName() {
    return this.resolveClassName() + 'Module';
  }

  public resolveServiceClassName() {
    return this.resolveClassName() + 'Service';
  }

  public resolveDtoNames() {
    const baseName = this.resolveClassName();
    return {
      create: 'Create' + baseName + 'Dto',
      update: 'Update' + baseName + 'Dto',
    };
  }

  public resolveDtoName(preffix: 'create' | 'update') {
    return _.upperFirst(preffix) + this.resolveClassName() + 'Dto';
  }

  public resolveSchemaNames() {
    const baseName = this.resolveClassName();
    return {
      create: 'create' + baseName + 'Schema',
      update: 'update' + baseName + 'Schema',
    };
  }

  public resolveSchemaName(preffix: 'create' | 'update') {
    return preffix + this.resolveClassName() + 'Schema';
  }
}
