import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  Get,
  Request,
  Head,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/core';
import { LoginDto, loginSchema } from './dto';
import { BearerToken, Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  public signIn(@Body() { accessKeyId, secretAccessKey }: LoginDto) {
    return this.authService.signIn(accessKeyId, secretAccessKey);
  }

  @Get('profile')
  public getProfile(@Request() req: any) {
    return req.user;
  }

  @Public()
  @Head('check-token')
  public async check(@BearerToken() token: string) {
    const { hasAccess } = await this.authService.verify(token);

    if (!hasAccess) {
      throw new UnauthorizedException();
    }

    return hasAccess;
  }

  @Public()
  @Post('refresh')
  public refresh(@Body() body: any) {
    return this.authService.refresh(body);
  }
}
