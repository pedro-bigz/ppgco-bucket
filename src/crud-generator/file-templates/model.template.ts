import { TemplateCompiler } from './base.template';

export const getCompiler = (props: object) => {
  return TemplateCompiler.create()
    .setContent(
      `
import { Column,<%= hasForeignKeys ? ' ForeignKey,' : '' %> Model, Table } from 'sequelize-typescript';

@Table({ tableName: '<%= tableName %>' })
export class <%= modelClassName %> extends Model {
  <% _.forEach(attributes, function(attribute, index) {  %><% if (attribute.isPKey) { %>@Column({ primaryKey: true, autoIncrement: true })<% } else { %>@Column<% } %>
  <% if (attribute.isFKey) { %>@ForeignKey(() => <%= attribute.references %>)\n  <% } %><%= attribute.name %>: <%= attribute.type %>;<% if(index + 1 < attributes.length) { %>\n\n  <% } %><% }); %>
}`,
    )
    .setProps(props)
    .compile();
};
