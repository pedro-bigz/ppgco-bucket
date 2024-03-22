import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(`export * from './<%= modelPath %>';`)
    .setProps(props)
    .compile();
};
