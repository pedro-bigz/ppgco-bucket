import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(
      `
import { Module } from '@nestjs/common';
import { <%= service.className %> } from './<%= service.path %>';
import { <%= controller.className %> } from './<%= controller.path %>';
import { <%= providers.name %> } from './<%= providers.path %>';

@Module({
  controllers: [<%= controller.className %>],
  providers: [<%= service.className %>, ...<%= providers.name %>],
})
export class <%= moduleClassName %> {}`,
    )
    .setProps(props)
    .compile();
};
