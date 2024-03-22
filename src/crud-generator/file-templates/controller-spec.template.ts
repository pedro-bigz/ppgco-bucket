import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(
      `
import { Test, TestingModule } from '@nestjs/testing';
import { <%= controllerClassName %> } from './<%= controllerPath %>';
import { <%= serviceClassName %> } from './<%= servicePath %>';

describe('<%= controllerClassName %>', () => {
  let controller: <%= controllerClassName %>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [<%= controllerClassName %>],
      providers: [<%= serviceClassName %>],
    }).compile();

    controller = module.get<<%= controllerClassName %>>(<%= controllerClassName %>);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});`,
    )
    .setProps(props)
    .compile();
};
