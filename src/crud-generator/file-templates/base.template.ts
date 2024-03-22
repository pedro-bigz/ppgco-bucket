import _trim from 'lodash/trim';
import _template from 'lodash/template';
import _ from 'lodash';

export class TemplateCompiler {
  private content: string;
  private props: object;

  public static create() {
    return new this();
  }

  public setContent(content: string) {
    this.content = _trim(content) + '\n';
    return this;
  }

  public setProps(props: object) {
    this.props = props;
    return this;
  }

  public compile() {
    const compile = _template(this.content);
    return compile({ ...this.props, _ });
  }
}
