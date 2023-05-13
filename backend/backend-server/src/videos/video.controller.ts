import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
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
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { EUserRole } from 'src/common/enums/user.enums';
import { removeUndefined } from 'src/common/helpers/removeUndefined';
import { Roles } from 'src/users/roles.decorator';
import { AuthMode, EAuth } from '../common/decorators/auth-mode.decorator.js';
import { EVideoState } from '../common/enums/video.enums.js';
import { MakeThumbnailDto } from './dtos/make-thumbnail-query-dto.ts.js';
import { VideoFiltersDto } from './dtos/video-filters.dto';
import { VideoService } from './video.service';

@Controller('videos')
@ApiTags('videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
  async uploadFile(
    @Req() httpRequest: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploaderId = httpRequest.user['_id'];

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
    const timecode = query.timecode ?? '50%';

    return await this.videoService.makeThumbnail(uploaderId, videoId, timecode);
  }

  @Roles(EUserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Blocks a video as a moderator' })
  @Patch(':videoId/block')
  async blockVideo(@Param('videoId') videoId: string) {
    const update = { state: EVideoState.BLOCKED };
    const data = await this.videoService.update(videoId, update);

    if (!data) throw new NotFoundException('This video does not exist');
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
  async deleteVideoFile(
    @Param('videoId') id: string,
    @Req() httpRequest: Request,
  ) {
    const userId = httpRequest.user['_id'];

    return await this.videoService.deleteVideoFile(id, userId);
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

  @AuthMode(EAuth.DISABLED)
  @Post(':videoId/add-view')
  async addView(@Param('videoId') videoId: string, @Req() req: Request) {
    const sender = req.headers['x-forwarded-for'];
    const fingerPrint = sender + videoId;

    if (await this.cacheManager.get(fingerPrint)) {
      throw new HttpException('Must wait before adding a new view', 429);
    }
    this.cacheManager.set(fingerPrint, 1, 1000 * 60);

    await this.videoService.addView(videoId);
  }
}
