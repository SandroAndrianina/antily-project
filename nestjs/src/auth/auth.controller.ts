// routes
import { Public } from './public.decorator';
import { Body, Controller, Patch, Post, UsePipes, ValidationPipe, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.service.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.service.login(dto);
  }

  @Get('me')
  currentLogged(@Req() req: any) {
    return this.service.currentLogged(req.user.sub);
  }

  @Patch('password')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req: any ){
    return this.service.changePassword(req.user.sub, dto);
  }

}