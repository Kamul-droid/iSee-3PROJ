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
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { AuthMode, EAuth } from 'src/common/decorators/auth-mode.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDocument } from './schema/user.schema';
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
    /**
     * If the update is a password change, it needs to be hashed.
     */
    if (body.password) {
      const salt = await bcrypt.genSalt(10);

      body.password = await bcrypt.hash(body.password, salt);
    }

    const { password, ...user } = await this.usersService
      .update(_id, body)
      .catch((e) => {
        if (e.code === 11000) {
          console.log(e);
          throw new ConflictException(
            `${Object.keys(e.keyValue)[0]} : ${
              Object.values(e.keyValue)[0]
            } is already in use`,
          );
        }
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
