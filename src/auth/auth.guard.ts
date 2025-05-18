import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { DONT_THROW_ACCESS_ERRORS, IS_PUBLIC_KEY } from './auth.decorator';
import { AuthService } from './auth.service';

export type UserPayload = {
  _id: number;
  email: string;
};

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  public dontThrowErrors(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(DONT_THROW_ACCESS_ERRORS, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    try {
      const request = context.switchToHttp().getRequest<Request>();

      if (!this.authService.hasValidHeaders()) {
        throw new UnauthorizedException('Invalid API key ou Secret Key');
      }

      if (!this.authService.isTimestampValid()) {
        throw new UnauthorizedException('Invalid or expired timestamp');
      }

      const user = await this.authService.getCurrentUser();

      const isValidSignature = this.authService.validateSignature(
        user.secretAccessKey,
      );

      if (!isValidSignature) {
        throw new UnauthorizedException('Invalid signature');
      }

      request['user'] = user;
    } catch (error) {
      if (this.dontThrowErrors(context)) {
        return true;
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new UnauthorizedException();
    }

    return true;
  }
}
