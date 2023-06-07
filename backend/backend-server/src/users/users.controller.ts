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

  @AuthMode(EAuth.DISABLED)
  @Post('sendValidationMail/:id')
  async sendValidationMail(
    @Param('id') _id: string,
    @Query('email') email: string,
  ) {
    await this.usersService.sendConfirmationEmail(_id, email);
  }

  @AuthMode(EAuth.DISABLED)
  @Post('validate-mail/')
  async validateMail(@Query('csr') csr: string, @Query('token') token: string) {
    const response = await this.usersService.validateConfirmationEmail(
      csr,
      token,
    );

    if (!response) throw new BadRequestException('Invalid Token');
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
