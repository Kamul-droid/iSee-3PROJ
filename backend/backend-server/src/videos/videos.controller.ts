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
import { VideosService } from './videos.service.js';
import mongoose from 'mongoose';
import { TimestampedPaginationRequestDto } from '../common/dtos/timestamped-pagination-request.dto.js';
import { env } from '../env.js';

@Controller('videos')
@ApiTags('videos')
export class VideosController {
  constructor(
    private readonly videoService: VideosService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @AuthMode(EAuth.DISABLED)
  @Get()
  @ApiOperation({
    summary: 'Gets all public videos',
  })
  async getPublicVideos(
    @Query('uploader_id') uploader_id: string,
    @Query('searchQuery') searchQuery: string,
    @Query() query: TimestampedPaginationRequestDto,
  ) {
    const from = query.from || new Date();
    const pageIdx = query.pageIdx || 0;
    const pageSize = query.pageSize || 15;

    const filter = {
      state: EVideoState.PUBLIC,
    };

    if (uploader_id) {
      filter['uploaderInfos._id'] = new mongoose.Types.ObjectId(uploader_id);
    }

    if (searchQuery) {
      filter['$or'] = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ];
      filter['$and'] = [{ state: EVideoState.PUBLIC }];
    }

    const res = await this.videoService.findPaginated(
      from,
      pageIdx,
      pageSize,
      filter,
    );

    const paginationLinks = this.videoService.generatePaginationLinks(
      removeUndefined({ from, pageIdx, pageSize, uploader_id, searchQuery }),
      res.total,
      `${env().urls.nginx}/videos`,
    );

    return { ...paginationLinks, ...res };
  }

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
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploaderId = request.user['_id'];

    return this.videoService.uploadVideoFile(uploaderId, file);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sets the thumbnail for a video' })
  @Patch(':videoId/make-thumbnail')
  async makeThumbnail(
    @Param('videoId') _id: string,
    @Query() query: MakeThumbnailDto,
    @Req() request: Request,
  ) {
    const uploaderId = request.user['_id'];
    const timecode = query.timecode ?? '50%';

    return await this.videoService.makeThumbnail(uploaderId, _id, timecode);
  }

  @Roles(EUserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Blocks a video as a moderator' })
  @Patch(':videoId/block')
  async blockVideo(@Param('videoId') _id: string) {
    const update = { state: EVideoState.BLOCKED };
    const data = await this.videoService.update(_id, update);

    if (!data) throw new NotFoundException('This video does not exist');
    return data;
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':videoId')
  @ApiOperation({ summary: 'Updates a video' })
  async updateVideo(@Param('videoId') _id: string, @Body() body) {
    const update = removeUndefined(body);
    console.log(update);
    const vid = await this.videoService.update(_id, update);

    if (!vid) throw new NotFoundException('This vide does not exist');
    return vid;
  }

  @ApiBearerAuth('JWT-auth')
  @Get('mine')
  @ApiOperation({
    summary:
      'Get all of your uploaded videos, in the context of channel management',
  })
  async userUploadedVideo(@Req() request: Request) {
    const id = request.user['_id'];

    const video = await this.videoService.getMyVideos(id);
    if (!video) throw new NotFoundException('This vide does not exist');
    return video;
  }

  @AuthMode(EAuth.DISABLED)
  @Get(':videoId')
  @ApiOperation({ summary: 'Get a single video, in the context of playing it' })
  async getById(@Param('videoId') _id: string) {
    const video = await this.videoService.getById(_id);
    if (!video) throw new NotFoundException('Not found');
    return video;
  }

  @ApiOperation({
    summary: 'Deletes a video file, preserves its informations',
  })
  @ApiBearerAuth('JWT-auth')
  @Delete(':videoId/file')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVideoFile(
    @Param('videoId') _id: string,
    @Req() request: Request,
  ) {
    const userId = request.user['_id'];

    return await this.videoService.deleteVideoFile(_id, userId);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':videoId/data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Deletes a video's informations",
  })
  async deleteVideo(@Param('videoId') _id: string) {
    await this.videoService.deleteVideoById(_id);

    return;
  }

  @AuthMode(EAuth.DISABLED)
  @Post(':videoId/add-view')
  async addView(@Param('videoId') _id: string, @Req() req: Request) {
    const sender = req.headers['x-forwarded-for'];
    const fingerPrint = sender + _id;

    if (await this.cacheManager.get(fingerPrint)) {
      throw new HttpException('Must wait before adding a new view', 429);
    }
    this.cacheManager.set(fingerPrint, 1, 1000 * 60);

    await this.videoService.addView(_id);
  }
}
