import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(
      `
import { <%= modelClassName %> } from './entities';
import { <%= constants.repository %> } from './<%= constants.path %>';

export const <%= providerName %> = [
  {
    provide: <%= constants.repository %>,
    useValue: <%= modelClassName %>,
  },
];`,
    )
    .setProps(props)
    .compile();
};
