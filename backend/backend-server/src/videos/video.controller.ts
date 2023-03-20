import { HttpService } from '@nestjs/axios';
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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { existsSync, unlinkSync } from 'fs';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { removeUndefined } from 'src/common/helpers/removeUndefined';
import { Dates } from 'src/common/schemas/date.schema';
import { UsersService } from 'src/users/users.service';
import { VideoUpdateDto } from './dtos/pick.video.dto';
import { UserUpdateVideoDto } from './dtos/user-update-video.dto';
import { VideoFiltersDto } from './dtos/video-filters.dto';
import { Video } from './schema/video.schema';
import { VideoService } from './video.service';

@Controller('videos')
@ApiTags('videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly userService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('upload')
  @ApiOperation({ summary: 'Uploads a video file' })
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
  async uploadFile(@Body() req: any, @Req() request: Request) {
    console.log(req);

    const id = request.user['_id'];
    const user = await this.userService.findById(id);
    const video: Partial<Video> = {
      uploaderInfos: {
        _id: id,
        username: user.username,
        avatar: user.avatar,
      },
      videoPath: req['file.path'].split('videos/').pop(),
    };

    // const thumbnailPath = `/thumbnails/${file.filename}.png`;
    // ffmpeg(file.path)
    //   .screenshots({
    //     timestamps: ['50%'],
    //     filename: `${file.filename}.png`,
    //     folder: path.join('/thumbnails'),
    //   })
    //   .on('end', () => {
    //     // Once the thumbnail is created, do something with it
    //     console.log('Thumbnail created!');
    //     req.thumbnail = thumbnailPath;
    //   })
    //   .on('error', (err) => {
    //     console.error(`Error creating thumbnail: ${err}`);
    //   });

    const data = await this.videoService.create(video);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Updates video infos after the file updload is done',
  })
  @Patch(':videoId/upload-data')
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Blocks a video as a moderator' })
  @Patch(':videoId/block')
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':videoId')
  @ApiOperation({ summary: 'Updates a video as its uploader' })
  async updateVideo(
    @Param('videoId') videoId: string,
    @Body() req: UserUpdateVideoDto,
  ) {
    // eslint-disable-next-line prettier/prettier
    const video = await this.videoService.getById(new mongoose.Types.ObjectId(videoId));

    if (video) {
      const update = removeUndefined({
        ...req,
        ['state.visibility']: req.visibility,
      });

      const vid = await this.videoService.update(video._id, update);
      return vid;
    }
    throw new NotFoundException('No video exist with this Id');
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('mine')
  @ApiOperation({
    summary:
      'Get all of your uploaded videos, in the context of channel management',
  })
  async userUploadedVideo(@Req() req: Request) {
    const id = req.user['_id'];

    const videoData = await this.videoService.getMyVideos(id);
    if (videoData) {
      return videoData;
    }
    throw new NotFoundException('Not found');
  }

  @Get(':_id')
  @ApiOperation({ summary: 'Get a single video, in the context of playing it' })
  async getById(@Param('_id') id: string) {
    const videoData = await this.videoService.getById(
      new mongoose.Types.ObjectId(id),
    );
    if (videoData) {
      return videoData;
    }
    throw new NotFoundException('Not found');
  }

  @Get('from/:userId')
  @ApiOperation({
    summary:
      "Gets all of a user's videos, in the context of viewing his channel",
  })
  async getVideosFrom(@Param('userId') userId: string) {
    console.log(userId);
    const videoData = await this.videoService.getAllPublic({
      ['uploaderInfos._id']: userId,
    });
    if (videoData) {
      return videoData;
    }
    throw new NotFoundException('Not found');
  }

  @Get()
  @ApiOperation({ summary: 'Gets all videos that can be seen by everyone' })
  async getPublicVideos(@Body() req: VideoFiltersDto) {
    const filter = removeUndefined({
      ['uploaderInfos._id']: req.uploader_id,
      ['title']: req.title,
    });

    const videoData = await this.videoService.getAllPublic(filter);
    if (videoData) {
      return videoData;
    }
    throw new NotFoundException('Not found');
  }

  @Get('search')
  @ApiOperation({
    summary:
      'Gets all videos that can be seen by everyone in the context of a search',
  })
  async search(@Query('value') value: string) {
    const res = await this.videoService.search(value);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Deletes a video file, preserves its informations',
  })
  @ApiBearerAuth('JWT-auth')
  @Delete(':videoId/file')
  async deleteVideoFile(@Param('videoId') id: string) {
    const video = await this.videoService
      .getById(new mongoose.Types.ObjectId(id))
      .catch(() => {
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
      return `Video file is deleted ${vid}`;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':videoId/data')
  @ApiOperation({
    summary: "Deletes a video's informations",
  })
  async deleteFile(@Param('id') id: string) {
    return await this.videoService.deleteVideoById(
      new mongoose.Types.ObjectId(id),
    );
  }
}
