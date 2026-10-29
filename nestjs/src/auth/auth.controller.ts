// routes
import { Public } from './public.decorator';
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Public()
@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.service.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.service.login(dto);
  }
}