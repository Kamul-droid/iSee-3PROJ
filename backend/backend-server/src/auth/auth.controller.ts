import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() req: LoginUserDto) {
    const user = await this.authService.validateUser(req);

    if (user === null)
      throw new UnauthorizedException('Invalid email or password');

    return await this.authService.login(user);
  }

  @Post('register')
  async register(@Body() req: CreateUserDto) {
    const user = await this.usersService.create(req).catch((e) => {
      if (e.code === 11000)
        throw new ConflictException('This email is already in use');
      throw new BadRequestException('Bad user data');
    });
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('test')
  async test() {
    return 'OK';
  }
}
