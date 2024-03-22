import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export { UserPayload } from 'src/auth';

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
