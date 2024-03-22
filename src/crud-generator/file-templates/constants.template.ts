import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(`export const <%= repositoryName %> = '<%= repositoryName %>';`)
    .setProps(props)
    .compile();
};
