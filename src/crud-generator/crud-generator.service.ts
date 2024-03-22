import { Injectable } from '@nestjs/common';
import {
  ConstantsGenerator,
  ControllerGenerator,
  ControllerSpecGenerator,
  ModuleGenerator,
  ModuleIndexGenerator,
  ModelGenerator,
  ModelIndexGenerator,
  ServiceGenerator,
  ServiceSpecGenerator,
  DtoCreateGenerator,
  DtoUpdateGenerator,
  DtoIndexGenerator,
  BaseGenerator,
  ProvidersGenerator,
  ModuleImportGenerator,
  ModelFolderGenerator,
  DtoFolderGenerator,
} from './generators';

export type IndividualGenerateType =
  | 'model'
  | 'dto'
  | 'createDto'
  | 'updateDto'
  | 'controller'
  | 'service';

@Injectable()
export class CrudGeneratorService {
  private queue: BaseGenerator[];

  public constructor(
    private dtoFolderGenerator: DtoFolderGenerator,
    private dtoIndexGenerator: DtoIndexGenerator,
    private dtoUpdateGenerator: DtoUpdateGenerator,
    private dtoCreateGenerator: DtoCreateGenerator,
    private constantsGenerator: ConstantsGenerator,
    private modelIndexGenerator: ModelIndexGenerator,
    private modelFolderGenerator: ModelFolderGenerator,
    private modelGenerator: ModelGenerator,
    private moduleIndexGenerator: ModuleIndexGenerator,
    private moduleGenerator: ModuleGenerator,
    private serviceSpecGenerator: ServiceSpecGenerator,
    private serviceGenerator: ServiceGenerator,
    private controllerSpecGenerator: ControllerSpecGenerator,
    private controllerGenerator: ControllerGenerator,
    private providersGenerator: ProvidersGenerator,
    private moduleImportGenerator: ModuleImportGenerator,
  ) {}

  public async init(
    tableName: string,
    force: boolean,
    log: boolean,
    only?: IndividualGenerateType,
  ) {
    const generators: Record<IndividualGenerateType, () => void> = {
      model: this.generateModel,
      dto: this.generateDto,
      createDto: this.generateCreateDto,
      updateDto: this.generateUpdateDto,
      controller: this.generateController,
      service: this.generateService,
    };

    const generator =
      !only || generators[only] ? this.generateAll : generators[only];

    generator.call(this);
    await this.execute(tableName, force, log);
  }

  public async generateModel() {
    this.makeQueue([
      this.modelFolderGenerator,
      this.modelIndexGenerator,
      this.modelGenerator,
      this.moduleGenerator,
    ]);
  }

  public async generateService() {
    this.makeQueue([
      this.modelFolderGenerator,
      this.modelIndexGenerator,
      this.modelGenerator,
      this.moduleGenerator,
      this.constantsGenerator,
      this.providersGenerator,
      this.serviceGenerator,
      this.serviceSpecGenerator,
    ]);
  }

  public async generateDto() {
    this.makeQueue([
      this.dtoFolderGenerator,
      this.dtoIndexGenerator,
      this.dtoCreateGenerator,
      this.dtoUpdateGenerator,
      this.moduleGenerator,
    ]);
  }

  public async generateCreateDto() {
    this.makeQueue([
      this.dtoFolderGenerator,
      this.dtoIndexGenerator,
      this.dtoCreateGenerator,
      this.moduleGenerator,
    ]);
  }

  public async generateUpdateDto() {
    this.makeQueue([
      this.dtoFolderGenerator,
      this.dtoIndexGenerator,
      this.dtoUpdateGenerator,
      this.moduleGenerator,
    ]);
  }

  public async generateController() {
    this.makeQueue([
      this.modelFolderGenerator,
      this.modelIndexGenerator,
      this.modelGenerator,
      this.moduleGenerator,
      this.controllerGenerator,
      this.controllerSpecGenerator,
    ]);
  }

  private generateAll() {
    this.makeQueue([
      this.modelFolderGenerator,
      this.dtoFolderGenerator,
      this.modelIndexGenerator,
      this.dtoIndexGenerator,
      this.moduleGenerator,
      this.modelGenerator,
      this.controllerGenerator,
      this.controllerSpecGenerator,
      this.serviceGenerator,
      this.serviceSpecGenerator,
      this.constantsGenerator,
      this.providersGenerator,
      this.dtoCreateGenerator,
      this.dtoUpdateGenerator,
    ]);
  }

  private makeQueue(queue: BaseGenerator[]) {
    this.queue = [
      this.moduleIndexGenerator,
      ...queue,
      this.moduleImportGenerator,
    ];
  }

  private async execute(tableName: string, force: boolean, log: boolean) {
    for (const item of this.queue) {
      await item.setLog(log).generate(tableName, force);
    }
  }
}
