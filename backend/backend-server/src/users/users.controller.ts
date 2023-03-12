import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('all-user')
  async webuser() {
    const response = await this.usersService.getAll();
    return response;
  }
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
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

  @Post('sendValidationMail/:id')
  async sendValidationMail(
    @Param('id') id: string,
    @Query('email') email: string,
  ) {
    await this.usersService.sendConfirmationEmail(
      new mongoose.Types.ObjectId(id),
      email,
    );
  }

  @Get('validate-mail/')
  async validateMail(@Query('csr') csr: string, @Query('token') token: string) {
    const response = await this.usersService.validateConfirmationEmail(
      new mongoose.Types.ObjectId(csr),
      token,
    );

    if (!response) throw new BadRequestException('Invalid Token');
    return 'Validation success';
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete('delete/:_id')
  async deleteAccount(@Param('_id') _id: string) {
    const response = await this.usersService.deleteAccount(_id);
    return response;
  }
}
