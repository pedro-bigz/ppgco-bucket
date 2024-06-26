import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_FORCED_AUTH, IS_PUBLIC_KEY } from './auth.decorator';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user';

export type UserPayload = {
  _id: number;
  email: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isForceAuth = this.reflector.getAllAndOverride<boolean>(
      IS_FORCED_AUTH,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic && !isForceAuth) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token && isForceAuth) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      const user = await this.userService.findOne(payload._id);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = user.dataValues;
    } catch (error) {
      throw new UnauthorizedException(error, error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
