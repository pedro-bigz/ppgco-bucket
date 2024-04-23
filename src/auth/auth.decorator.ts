import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Private = () => SetMetadata(IS_PUBLIC_KEY, false);

export const IS_FORCED_AUTH = 'isForceAuth';
export const ForceAuth = () => SetMetadata(IS_FORCED_AUTH, true);

export const BearerToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().headers.authorization;
  },
);
