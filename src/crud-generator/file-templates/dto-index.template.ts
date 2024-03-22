import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(
      `
export * from './<%= dtoCreatePath %>';
export * from './<%= dtoUpdatePath %>';`,
    )
    .setProps(props)
    .compile();
};
