export const paths = {
  separator: '/',
  app: {
    root: 'src',
    dto: 'dto',
    model: 'entities',
    module: 'app.module.ts',
    subfolders: {
      models: 'entities',
      dto: 'dto',
    },
  },
  generator: {
    root: 'src/crud-generator',
    templates: 'file-templates',
    helpers: 'helpers',
    services: 'services',
    inputs: 'inputs',
  },
  templates: {
    model: 'model.template.ts',
    modelIndex: 'model-index.template.ts',
    controller: 'controller.template.ts',
    controllerSpec: 'controller-spec.template.ts',
    service: 'service.template.ts',
    serviceSpec: 'service-spec.template.ts',
    module: 'module.template.ts',
    moduleIndex: 'module-index.template.ts',
    providers: 'providers.template.ts',
    constants: 'constants.template.ts',
    dtoCreate: 'dto-create.template.ts',
    dtoUpdate: 'dto-update.template.ts',
    dtoIndex: 'dto-index.template.ts',
  },
  extension: {
    model: '.entity.ts',
    controller: '.controller.ts',
    service: '.service.ts',
    module: '.module.ts',
    providers: '.providers.ts',
    constants: '.constants.ts',
    dto: '.dto.ts',
    index: '.ts',
    controllerSpec: '.controller.spec.ts',
    serviceSpec: '.service.spec.ts',
  },
  tests: {
    controller: '.controller.spec.ts',
    service: '.service.spec.ts',
  },
};

export type ExtensionType =
  | 'model'
  | 'controller'
  | 'service'
  | 'module'
  | 'providers'
  | 'constants'
  | 'dto'
  | 'index'
  | 'controllerSpec'
  | 'serviceSpec';

export const TypePairConstants = [
  ['int', 'number'],
  ['bigint', 'number'],
  ['numberic', 'number'],
  ['decimal', 'number'],
  ['boolean', 'boolean'],
  ['tinyint', 'boolean'],
  ['enum', 'string'],
  ['char', 'string'],
  ['varchar', 'string'],
  ['text', 'string'],
  ['date', 'Date'],
  ['bytea', 'Blob'],
  ['timestamp', 'Date'],
];

export const TypeConstants = Object.fromEntries(TypePairConstants);
export const DBTypeConstants = Object.keys(TypeConstants);
