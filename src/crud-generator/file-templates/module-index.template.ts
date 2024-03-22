import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(
      `
export * from './entities';
export * from './dto';
export * from './<%= controllerPath %>';
export * from './<%= servicePath %>';
export * from './<%= constantsPath %>';
export * from './<%= providersPath %>';
export * from './<%= modulePath %>';
      `,
    )
    .setProps(props)
    .compile();
};
