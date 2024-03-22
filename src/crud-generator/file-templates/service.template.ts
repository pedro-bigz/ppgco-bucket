import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(
      `
import { Inject, Injectable } from '@nestjs/common';
import { <%= model.repository %> } from './<%= constantsPath %>';
import { <%= model.type %> } from './entities';
import { <%= dto.create.type %>, <%= dto.update.type %> } from './dto';
import { AppListing, Query } from 'core';

@Injectable()
export class <%= serviceClassName %> {
  public constructor(
    @Inject(<%= model.repository %>)
    private readonly <%= model.name %>: typeof <%= model.type %>,
  ) {}

  public findAll() {
    return this.<%= model.name %>.findAll();
  }

  public async find(
    page: number,
    perPage: number,
    search: string,
    searchIn: string = '<%= primaryKey.name %>',
    order: Record<string, 'ASC' | 'DESC'>,
  ) {
    return AppListing.create<typeof <%= model.type %>>(this.<%= model.name %>)
      ?.attachPagination(page, perPage)
      ?.attachOrderObj(order || { <%= primaryKey.name %>: 'DESC' })
      ?.attachSearch(search, searchIn)
      ?.modifyQuery((query: Query) => {
        return {
          ...query,
        };
      })
      ?.get<<%= model.type %>>();
  }

  public findOne(<%= primaryKey.name %>: <%= primaryKey.type %>) {
    return this.<%= model.name %>.findOne({ where: { <%= primaryKey.name %> } });
  }

  public create(<%= dto.create.name %>: <%= dto.create.type %>) {
    return this.<%= model.name %>.create({ ...<%= dto.create.name %> });
  }

  public update(<%= primaryKey.name %>: <%= primaryKey.type %>, <%= dto.update.name %>: <%= dto.update.type %>) {
    return this.<%= model.name %>.update(<%= dto.update.name %>, { where: { <%= primaryKey.name %> } });
  }

  public remove(<%= primaryKey.name %>: <%= primaryKey.type %>) {
    return this.<%= model.name %>.destroy({ where: { <%= primaryKey.name %> } });
  }
}`,
    )
    .setProps(props)
    .compile();
};
