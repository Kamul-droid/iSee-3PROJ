import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
import { AuthMode, EAuth } from '../common/decorators/auth-mode.decorator.js';
import { EUserRole } from 'src/common/enums/user.enums';
import { removeUndefined } from 'src/common/helpers/removeUndefined';
import { Roles } from 'src/users/roles.decorator';
import { EVideoState } from '../common/enums/video.enums.js';
import { MakeThumbnailDto } from './dtos/make-thumbnail-query-dto.ts';
import { VideoFiltersDto } from './dtos/video-filters.dto';
import { VideoService } from './video.service';

@Controller('videos')
@ApiTags('videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly httpService: HttpService,
  ) {}

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
  async uploadFile(@Body() payload: any, @Req() httpRequest: Request) {
    const uploaderId = httpRequest.user['_id'];
    const file = {
      path: payload['file.path'].split('videos/').pop(),
      size: parseInt(payload['file.size']),
    };

    return this.videoService.uploadVideoFile(uploaderId, file);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sets the thumbnail for a video' })
  @Patch(':videoId/make-thumbnail')
  async makeThumbnail(
    @Param('videoId') videoId: string,
    @Query() query: MakeThumbnailDto,
    @Req() httpRequest: Request,
  ) {
    const uploaderId = httpRequest.user['_id'];
    const timecode = query.timecode;

    await this.videoService.userOwnsVideoCheck(uploaderId, videoId);
    return await this.videoService.makeThumbnail(uploaderId, videoId, timecode);
  }

  @Roles(EUserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Blocks a video as a moderator' })
  @Patch(':videoId/block')
  async blockVideo(@Param('videoId') videoId: string) {
    const update = { 'state.isBlocked': true };
    const data = await this.videoService.update(videoId, update);

    if (!data) throw new NotFoundException('This vide does not exist');
    return data;
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':videoId')
  @ApiOperation({ summary: 'Updates a video' })
  async updateVideo(@Param('videoId') videoId: string, @Body() req) {
    const update = removeUndefined(req);
    console.log(update);
    const vid = await this.videoService.update(videoId, update);

    if (!vid) throw new NotFoundException('This vide does not exist');
    return vid;
  }

  @ApiBearerAuth('JWT-auth')
  @Get('mine')
  @ApiOperation({
    summary:
      'Get all of your uploaded videos, in the context of channel management',
  })
  async userUploadedVideo(@Req() req: Request) {
    const id = req.user['_id'];

    const video = await this.videoService.getMyVideos(id);
    if (!video) throw new NotFoundException('This vide does not exist');
    return video;
  }

  @AuthMode(EAuth.DISABLED)
  @Get('search')
  @ApiOperation({
    summary:
      'Gets all videos that can be seen by everyone in the context of a search',
  })
  async search(@Query('query') query: string) {
    return await this.videoService.search(query);
  }

  @AuthMode(EAuth.DISABLED)
  @Get(':_id')
  @ApiOperation({ summary: 'Get a single video, in the context of playing it' })
  async getById(@Param('_id') id: string) {
    const video = await this.videoService.getById(id);
    if (!video) throw new NotFoundException('Not found');
    return video;
  }

  @AuthMode(EAuth.DISABLED)
  @Get('from/:userId')
  @ApiOperation({
    summary:
      "Gets all of a user's videos, in the context of viewing his channel",
  })
  async getVideosFrom(@Param('userId') userId: string) {
    const video = await this.videoService.find({
      ['uploaderInfos._id']: userId,
      state: EVideoState.PUBLIC,
    });

    return video;
  }

  @AuthMode(EAuth.DISABLED)
  @Get()
  @ApiOperation({ summary: 'Gets all videos that can be seen by everyone' })
  async getPublicVideos(@Query() req: VideoFiltersDto) {
    const filter = removeUndefined({
      ['uploaderInfos._id']: req.uploader_id,
      ['title']: req.title,
      state: EVideoState.PUBLIC,
    });

    const videoData = await this.videoService.find(filter);
    if (!videoData) throw new NotFoundException('Not found');
    return videoData;
  }

  @ApiOperation({
    summary: 'Deletes a video file, preserves its informations',
  })
  @ApiBearerAuth('JWT-auth')
  @Delete(':videoId/file')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVideoFile(@Param('videoId') id: string) {
    const update = {
      videoPath: '',
      state: EVideoState.DELETED,
    };
    const video = await this.videoService.update(id, update);

    if (!video) throw new NotFoundException('This video does not exist');

    return;
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':videoId/data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Deletes a video's informations",
  })
  async deleteVideo(@Param('id') id: string) {
    await this.videoService.deleteVideoById(id);

    return;
  }
}
