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
  Query,
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
import { Video } from './schema/video.schema';
import { EVideoVisibility } from 'src/common/enums/video.enums';

const storage = diskStorage({
  destination: '/uploads',
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
      req.uploaderInfos = {
        _id: id,
        username: user.username,
        avatar: user.avatar,
      };
    }
    req.videoPath = file.path;
    req.dates = new Dates();
    console.log('====================================');
    console.log(file);
    console.log('====================================');
    // generate thumbnails
    const thumbnailPath = `/thumbnails/${file.filename}.png`;
    // ffmpeg.setFfprobePath(
    //   'backend\\backend-server\\node_modules\\fluent-ffmpeg\\lib\\ffprobe.js',
    // );
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
    const video = {
      ...req,
      ['dates.updatedAt']: new Date(),
    };

    const data = await this.videoService.update(
      new mongoose.Types.ObjectId(id),
      video,
    );
    if (data._id) {
      return data;
    }
    throw new BadRequestException('Error with the id');
  }

  @Patch('block/:videoId')
  async blockVideo(@Param('videoId') videoId: string) {
    // eslint-disable-next-line prettier/prettier
    const video = await this.videoService.getById(new mongoose.Types.ObjectId(videoId));
    if (video) {
      video.state.isBlocked = true;
      const vid = await this.videoService.update(video._id, video);
      return vid;
    }
    throw new NotFoundException('No video exist with this Id');
  }

  @Patch('edit-visibility-hidden/:videoId')
  async editVideoVisibility(@Param('videoId') videoId: string) {
    // eslint-disable-next-line prettier/prettier
    const video = await this.videoService.getById(new mongoose.Types.ObjectId(videoId));
    if (video) {
      video.state.visibility = EVideoVisibility.HIDDEN;
      const vid = await this.videoService.update(video._id, video);
      return vid;
    }
    throw new NotFoundException('No video exist with this Id');
  }

  @Patch('edit-visibility-public/:videoId')
  async editVideoVisibilityPublic(@Param('videoId') videoId: string) {
    // eslint-disable-next-line prettier/prettier
    const video = await this.videoService.getById(new mongoose.Types.ObjectId(videoId));
    if (video) {
      video.state.visibility = EVideoVisibility.PUBLIC;
      const vid = await this.videoService.update(video._id, video);
      return vid;
    }
    throw new NotFoundException('No video exist with this Id');
  }

  @Patch('edit-visibility-private/:videoId')
  async editVideoVisibilityPrivate(@Param('videoId') videoId: string) {
    // eslint-disable-next-line prettier/prettier
    const video = await this.videoService.getById(new mongoose.Types.ObjectId(videoId));
    if (video) {
      video.state.visibility = EVideoVisibility.PRIVATE;
      const vid = await this.videoService.update(video._id, video);
      return vid;
    }
    throw new NotFoundException('No video exist with this Id');
  }

  @Get('user-videos/:id')
  async userUploadedVideo(@Param('id') id: string) {
    const uploader = await this.userService.findById(id).catch((e) => {
      throw new NotFoundException('Unknown Id');
    });

    const uploaderInfo = {
      _id: id,
      username: uploader.username,
      avatar: uploader.avatar,
    };

    const videoData = await this.videoService.findAllByUserId(uploaderInfo);
    if (videoData) {
      return videoData;
    }
    throw new NotFoundException('Not found');
  }

  @Get('videos/all')
  async uploadedVideo() {
    const videoData = await this.videoService.getAll();
    if (videoData) {
      return videoData;
    }
    throw new NotFoundException('Not found');
  }
  @Get('public/all')
  async publicVideo() {
    const videoData = await this.videoService.getAllVideoWithVisibility(
      EVideoVisibility.PUBLIC,
    );
    if (videoData) {
      return videoData;
    }
    throw new NotFoundException('Not found');
  }
  @Get('private/all')
  async privateVideo() {
    const videoData = await this.videoService.getAllVideoWithVisibility(
      EVideoVisibility.PRIVATE,
    );
    if (videoData) {
      return videoData;
    }
    throw new NotFoundException('Not found');
  }
  @Get('hidden/all')
  async hiddenVideo() {
    const videoData = await this.videoService.getAllVideoWithVisibility(
      EVideoVisibility.HIDDEN,
    );
    if (videoData) {
      return videoData;
    }
    throw new NotFoundException('Not found');
  }

  @Get('search')
  async search(@Query('value') value: string) {
    const res = await this.videoService.search(value);
    return res;
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
      video.videoPath = '';
      video.state.isDeleted = true;
      const vid = await this.videoService.update(video._id, video);
      return `Video file is deleted `;
    }
  }

  @Delete('delete-video-data/:videoId')
  async deleteFile(@Param('id') id: string) {
    return await this.videoService.deleteVideoById(
      new mongoose.Types.ObjectId(id),
    );
  }
}
