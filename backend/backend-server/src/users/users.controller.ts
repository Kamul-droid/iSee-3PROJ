import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() req: CreateUserDto) {
    const { password, ...user } = await this.usersService
      .create(req)
      .catch((e) => {
        if (e.code === 11000)
          throw new ConflictException('This email is already in use');
        throw new BadRequestException('Bad user data');
      });
    return user;
  }

  @Patch(':id')
  async update(@Body() req: UpdateUserDto, @Param('id') id: string) {
    const { password, ...user } = await this.usersService
      .update(new mongoose.Types.ObjectId(id), req)
      .catch((e) => {
        if (e.code === 11000)
          throw new ConflictException('This email is already in use');
        throw new BadRequestException('Bad user data');
      });
    return user;
  }
}
