import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserService } from 'src/user';

type TokenType = {
  _id: number;
  email: string;
  nome: string;
};

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signIn(
    accessKeyId: string,
    secretAccessKey: string,
  ): Promise<any> {
    const user = await this.usersService.findByAccessKeyID(accessKeyId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { secretAccessKey: storedPassword, id: userId } = user.dataValues;

    if (!bcrypt.compareSync(secretAccessKey, storedPassword)) {
      throw new UnauthorizedException();
    }

    const payload = {
      _id: userId,
      accessKeyId,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '4h',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
    });

    return {
      auth: { accessToken, refreshToken },
    };
  }

  private extractTokenFromAuthorization(authorization: string): string {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }

  public async verify(authorization: string | undefined | null) {
    try {
      if (!authorization) {
        throw new Error();
      }

      const hasAccess = await this.jwtService.verifyAsync<TokenType>(
        this.extractTokenFromAuthorization(authorization),
      );

      return { hasAccess: !!hasAccess };
    } catch (error) {
      return { hasAccess: false };
    }
  }

  public async refresh(requestBody: any) {
    const token = requestBody.refreshToken;

    const payload = this.jwtService.verifyAsync<TokenType>(token, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '4h',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
    });

    return { auth: { accessToken, refreshToken } };
  }
}
