import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { FilterQuery } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import buildQueryParams from 'src/common/helpers/buildQueryParams';
import { buildSortObject } from 'src/common/helpers/buildSortObject';
import { Dates } from 'src/common/schemas/date.schema';
import { env } from 'src/env';
import { UsersService } from 'src/users/users.service';
import { VideoService } from 'src/videos/video.service';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { GetCommentsFromVideoDto } from './dto/getCommentsFromVideo.dto';
import { Comment } from './schema/comment.schema';

@Controller('comments')
@ApiTags('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UsersService,
    private readonly videoService: VideoService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('')
  async addComment(
    @Query('videoId') videoId: string,
    @Body() req: CommentDto,
    @Req() request: Request,
  ) {
    const id = request.user['_id'];

    console.log(req);

    const user = await this.userService.findById(id);
    const video = await this.videoService.getById(videoId);
    if (!user)
      throw new InternalServerErrorException(
        'Something went wrong, your account informations could not be found',
      );
    if (!video) throw new NotFoundException('No video found');

    const _comment = {
      videoid: video.id,
      content: req.content,
      dates: new Dates(),
      authorInfos: {
        _id: id,
        username: user.username,
        avatar: user.avatar,
      },
    } as Comment;

    return await this.commentService.create(_comment);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':commentId')
  async updateCommentOnly(
    @Param('commentId') id: string,
    @Body() req: CommentDto,
  ) {
    const data = await this.commentService.update(id, req);
    if (!data) throw new NotFoundException();

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('from-video/:videoId')
  async getVideoComment(
    @Param('videoId') videoId: string,
    @Query() query: GetCommentsFromVideoDto,
  ) {
    const filters = {
      $lt: query.commentsFrom ?? new Date(),
      videoid: videoId,
    } as FilterQuery<Comment>;

    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const sort = buildSortObject(query.sort);

    const res = await this.commentService.findAll(
      filters,
      pageSize,
      page,
      sort,
    );

    const nextParams = buildQueryParams({
      ...query,
      page: page + 1,
    });
    const prevParams = buildQueryParams({
      ...query,
      page: page - 1,
    });
    const next =
      page * pageSize < res.total
        ? `${env().urls.nginx}/comments/from-video/${videoId}${nextParams}`
        : null;
    const prev =
      page > 1
        ? `${env().urls.nginx}/comments/from-video/${videoId}${prevParams}`
        : null;

    return {
      next,
      prev,
      ...res,
    };
  }
}
