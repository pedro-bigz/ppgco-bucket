import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(
      `
import {
  Body,
  Query,
  Param,
  Get,
  Patch,
  Post,
  Delete,
  Controller,
} from '@nestjs/common';
import { <%= service.className %> } from './<%= service.path %>';
import {
  <%= dto.create.type %>,
  <%= dto.update.type %>,
  <%= schema.create %>,
  <%= schema.update %>,
} from './dto';
import { ZodValidationPipe } from 'core';

@Controller('<%= routePreffix %>')
export class <%= controllerClassName %> {
  public constructor(private readonly <%= service.name %>: <%= service.className %>) {}

  @Get()
  public findAll(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('search') search: string,
    @Query('searchIn') searchIn: string,
    @Query('order') order: Record<string, 'ASC' | 'DESC'>,
  ) {
    return this.<%= service.name %>.find(+page, +perPage, search, searchIn, order);
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.<%= service.name %>.findOne(+id);
  }

  @Post()
  public create(
    @Body(new ZodValidationPipe(<%= schema.create %>))
    <%= dto.create.name %>: <%= dto.create.type %>,
  ) {
    return this.<%= service.name %>.create(<%= dto.create.name %>);
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(<%= schema.update %>))
    <%= dto.update.name %>: <%= dto.update.type %>,
  ) {
    return this.<%= service.name %>.update(+id, <%= dto.update.name %>);
  }

  @Delete(':id')
  public destroy(@Param('id') id: string) {
    return this.<%= service.name %>.remove(+id);
  }
}`,
    )
    .setProps(props)
    .compile();
};
