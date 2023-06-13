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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthMode, EAuth } from 'src/common/decorators/auth-mode.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { User, UserDocument } from './schema/user.schema';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('JWT-auth')
  @Get('all')
  async webuser() {
    const response = await this.usersService.find();
    return response;
  }

  @ApiBearerAuth('JWT-auth')
  @Patch()
  async update(@Body() body: UpdateUserDto, @Req() request: Request) {
    const _id = request.user['_id'];

    const { password, ...user } = await this.usersService
      .update(_id, body)
      .catch((e) => {
        if (e.code === 11000)
          throw new ConflictException('This email is already in use');
        throw new BadRequestException('Bad user data');
      });
    return user;
  }

  @AuthMode(EAuth.DISABLED)
  @Get(':id')
  async getUser(@Param('id') _id: string) {
    return await this.usersService.getProfileInfos(_id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('send-validation-email')
  async sendValidationMail(@Req() request: Request) {
    const { _id, email } = request.user as UserDocument;
    await this.usersService.sendConfirmationEmail(_id.toString(), email);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('validate-email')
  async validateMail(@Req() request: Request, @Body('code') code: string) {
    const _id = request.user['_id'];

    const response = await this.usersService.validateConfirmationEmail(
      _id.toString(),
      code,
    );

    if (!response) throw new BadRequestException('Bad validation code');
    return 'Validation success';
  }

  @ApiBearerAuth('JWT-auth')
  @Delete()
  async deleteAccount(@Req() request: Request) {
    const _id = request.user['_id'];
    return await this.usersService.deleteAccount(_id);
  }

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
  async setProfilePicture(
    @Req() httpRequest: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const _id = httpRequest.user['_id'];
    return this.usersService.setProfilePic(_id, file);
  }
}
