import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(
      `
import { Test, TestingModule } from '@nestjs/testing';
import { <%= serviceClassName %> } from './<%= servicePath %>';

describe('<%= serviceClassName %>', () => {
  let service: <%= serviceClassName %>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [<%= serviceClassName %>],
    }).compile();

    service = module.get<<%= serviceClassName %>>(<%= serviceClassName %>);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});`,
    )
    .setProps(props)
    .compile();
};
