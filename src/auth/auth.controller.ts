import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'core';
import { LoginDto, loginSchema } from './dto';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  public signIn(@Body() { email, password }: LoginDto) {
    return this.authService.signIn(email, password);
  }

  @Get('profile')
  public getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('check-token')
  public check(@Request() req: any) {
    return this.authService.verify(req.headers.authorization);
  }

  @Public()
  @Post('refresh')
  public refresh(@Body() body) {
    return this.authService.refresh(body);
  }
}
