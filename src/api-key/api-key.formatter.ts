import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import _trim from 'lodash/trim';
import _isEmpty from 'lodash/isEmpty';

@Injectable({ scope: Scope.REQUEST })
export class ApiKeyFormatter {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  // get request() {
  //   return { body: '', path: '' };
  // }

  public formatPath(): string {
    return '/' + _trim(this.request.path.toUpperCase(), ' /');
  }

  public formatBody(): string {
    if (!this.hasRequestBody()) {
      return '';
    }

    if (this.isStringBody()) {
      return this.request.body as string;
    }

    if (this.isObjectBody()) {
      return JSON.stringify(this.request.body);
    }

    return '';
  }

  private hasRequestBody(): boolean {
    return this.request.body && !_isEmpty(this.request.body);
  }

  private isStringBody(): boolean {
    return typeof this.request.body === 'string';
  }

  private isObjectBody(): boolean {
    return typeof this.request.body === 'object';
  }
}
