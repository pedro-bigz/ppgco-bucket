import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Private = () => SetMetadata(IS_PUBLIC_KEY, false);

export const DONT_THROW_ACCESS_ERRORS = 'dontThrowAccessErrors';
export const DontThrowAccessErrors = () =>
  SetMetadata(DONT_THROW_ACCESS_ERRORS, true);

export const BearerToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().headers.authorization;
  },
);
