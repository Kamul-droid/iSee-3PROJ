import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { UploadVideoDto } from './dtos/upload-video.dto';
import { VideoService } from './video.service';
import { diskStorage } from 'multer';
import { UsersService } from 'src/users/users.service';
import { ReducedUser } from 'src/users/schema/reducedUser.schema';
import { ReducedUserDto } from 'src/users/dtos/reduce-user.dto';
import { Dates } from 'src/common/schemas/date.schema';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import { VideoUpdateDto } from './dtos/pick.video.dto';
import { existsSync, unlinkSync } from 'fs';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

@Controller('videos')
@ApiTags('videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly userService: UsersService,
  ) {}

  @Post('upload/:uploaderId')
  @ApiOperation({ summary: 'Upload a video file' })
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
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @Param('uploaderId') id: string,
    @UploadedFile() file,
    @Body() req: UploadVideoDto,
  ) {
    const user = await this.userService.findById(id);
    if (user) {
      const usrRed = new ReducedUser();
      usrRed.username = user.username;
      usrRed._id = id;
      usrRed.avatar = user.avatar;
      if (usrRed.username) {
        req.uploaderInfos = usrRed;
      }
    }
    req.videoPath = file.path;
    req.dates = new Dates();
    console.log('====================================');
    console.log(file);
    console.log('====================================');
    // generate thumbnails
    const thumbnailPath = path.join(
      __dirname,
      'thumbnails',
      `${file.filename}.png`,
    );
    ffmpeg.setFfprobePath(
      'backend\\backend-server\\node_modules\\fluent-ffmpeg\\lib\\ffprobe.js',
    );
    ffmpeg(file.path)
      .screenshots({
        timestamps: ['50%'],
        filename: `${file.filename}.png`,
        folder: path.join(__dirname, 'thumbnails'),
      })
      .on('end', () => {
        // Once the thumbnail is created, do something with it
        console.log('Thumbnail created!');
        req.thumbnail = thumbnailPath;
      })
      .on('error', (err) => {
        console.error(`Error creating thumbnail: ${err}`);
      });
    const data = await this.videoService.create(req);
    return data;
  }

  @Patch('update-video-metadata/:videoId')
  async updateMeta(@Param('videoId') id: string, @Body() req: VideoUpdateDto) {
    req.dates.updatedAt = new Date();
    const data = await this.videoService.update(
      new mongoose.Types.ObjectId(id),
      req,
    );
    if (data._id) {
      return data;
    }
    throw new BadRequestException('Error with the id');
  }

  @Get('my-videos')
  async uploadedVideo() {
    const videoData = await this.videoService.getAll();
    if (videoData) {
      return videoData;
    }
    throw new NotFoundException('Not found');
  }
  @Delete('delete-video-file/:videoId')
  async deleteVideoFile(@Param('videoId') id: string) {
    const video = await this.videoService
      .getById(new mongoose.Types.ObjectId(id))
      .catch((e) => {
        throw new NotFoundException("video doesn't exist");
      });
    if (video) {
      const url = video.videoPath;
      if (!existsSync(url)) {
        throw new NotFoundException(`No video file found `);
      }
      unlinkSync(url);
      return `File deleted `;
    }

    return await this.videoService.deleteVideoById(
      new mongoose.Types.ObjectId(id),
    );
  }
  @Delete('delete-video-data/:videoId')
  async deleteFile(@Param('id') id: string) {
    return await this.videoService.deleteVideoById(
      new mongoose.Types.ObjectId(id),
    );
  }
}
