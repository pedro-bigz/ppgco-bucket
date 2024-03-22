import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(
      `
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
<%= setImportString(imports) %>

export const <%= schemaName %> = z.object({
<% _.each(attributes, function(attribute, index) {  %>  <%= attribute.name %>: <%= attribute.validation %>,
<% }) %>});


export class <%= dtoName %> {
<% _.each(attributes, function(attribute, index) { %>
  @ApiProperty(<% if(!attribute.isNullable) { %>{ required: true }<% } %>)
  <%= attribute.name %>: <%= attribute.type %>;<% if(index + 1 < attributes.length) { %>\n\n  <% } %>
<% }) %>}`,
    )
    .setProps(props)
    .compile();
};
