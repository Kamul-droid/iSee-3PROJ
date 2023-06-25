import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthMode, EAuth } from 'src/common/decorators/auth-mode.decorator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
@AuthMode(EAuth.DISABLED)
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto) {
    const user = await this.authService.validateUser(body);

    if (user === null)
      throw new UnauthorizedException('Invalid email or password');

    return await this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body).catch((e) => {
      if (e.code === 11000) {
        console.log(e);
        throw new ConflictException(
          `${Object.keys(e.keyValue)[0]} : ${
            Object.values(e.keyValue)[0]
          } is already in use`,
        );
      }
      throw new BadRequestException('Bad user data');
    });
    return this.authService.login(user);
  }

  @AuthMode(EAuth.ENABLED)
  @ApiBearerAuth('JWT-auth')
  @Get('test')
  async test() {
    return 'OK';
  }
}
