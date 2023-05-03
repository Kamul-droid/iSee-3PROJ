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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('all')
  async webuser() {
    const response = await this.usersService.getAll();
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch()
  async update(@Body() data: UpdateUserDto, @Req() req: Request) {
    const id = req.user['_id'];

    const { password, ...user } = await this.usersService
      .update(new mongoose.Types.ObjectId(id), data)
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

  @Post('validate-mail/')
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
  @Delete()
  async deleteAccount(@Req() req: Request) {
    const id = req.user['_id'];
    const response = await this.usersService.deleteAccount(id);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Post('set-profile-picture')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async setProfilePicture(@Body() payload: any, @Req() httpRequest: Request) {
    const uploaderId = httpRequest.user['_id'];
    const filePath = payload['file.path'].split('profile-pictures/').pop();

    console.log(payload);

    const { password, ...user } = await this.usersService.update(uploaderId, {
      avatar: filePath,
    });

    return user;
  }
}
