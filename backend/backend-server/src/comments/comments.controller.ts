import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import mongoose, { FilterQuery } from 'mongoose';
import { EUserRole } from 'src/common/enums/user.enums';
import buildQueryParams from 'src/common/helpers/buildQueryParams';
import { buildSortObject } from 'src/common/helpers/buildSortObject';
import { env } from 'src/env';
import { UsersService } from 'src/users/users.service';
import { VideosService } from 'src/videos/videos.service';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';
import { GetCommentsFromVideoDto } from './dto/getCommentsFromVideo.dto';
import { Comment } from './schema/comment.schema';
import { AuthMode, EAuth } from 'src/common/decorators/auth-mode.decorator';

@Controller('comments')
@ApiTags('comments')
@ApiBearerAuth('JWT-auth')
export class CommentsController {
  constructor(
    private readonly commentService: CommentsService,
    private readonly userService: UsersService,
    private readonly videoService: VideosService,
  ) {}

  @Post('')
  async addComment(
    @Query('videoId') video_id: string,
    @Body() body: CommentDto,
    @Req() request: Request,
  ) {
    const user_id = request.user['_id'];

    if (!user_id) {
      throw new InternalServerErrorException(
        'Something went wrong with the user object',
      );
    }

    const user = await this.userService.findById(user_id);
    const video = await this.videoService.getById(video_id);
    if (!user)
      throw new InternalServerErrorException(
        'Something went wrong, your account informations could not be found',
      );
    if (!video) throw new NotFoundException('No video found');

    const comment = {
      videoid: video.id,
      content: body.content,
      authorInfos: {
        _id: user_id,
        username: user.username,
        avatar: user.avatar,
      },
    } as Comment;

    return await this.commentService.create(comment);
  }

  @Patch(':commentId')
  async updateCommentOnly(
    @Param('commentId') _id: string,
    @Body() body: CommentDto,
  ) {
    const data = await this.commentService.update(_id, body);
    if (!data) throw new NotFoundException();

    return data;
  }

  @AuthMode(EAuth.OPTIONAL)
  @Get('from-video/:videoId')
  async getVideoComment(
    @Param('videoId') video_id: string,
    @Req() request: Request,
    @Query() query: GetCommentsFromVideoDto,
  ) {
    const commentsFrom = query.commentsFrom
      ? new Date(query.commentsFrom)
      : new Date();

    const userId = request.user?.['_id'];

    const filters = {
      createdAt: { $lt: commentsFrom },
      videoid: video_id,
      ...(userId &&
        query.mine && {
          'authorInfos._id': new mongoose.Types.ObjectId(userId),
        }),
    } as FilterQuery<Comment>;

    const page = query.page || 1;
    const pageSize = query.pageSize || 5;
    const sort = buildSortObject(query.sort);

    const res = await this.commentService.findAll(
      filters,
      pageSize,
      page,
      sort,
      userId,
    );

    const nextParams = buildQueryParams({
      ...query,
      commentsFrom: commentsFrom.toISOString(),
      page: page + 1,
    });
    const prevParams = buildQueryParams({
      ...query,
      commentsFrom: commentsFrom.toISOString(),
      page: page - 1,
    });
    const next =
      page * pageSize < res.total
        ? `${env().urls.nginx}/comments/from-video/${video_id}${nextParams}`
        : null;
    const prev =
      page > 1
        ? `${env().urls.nginx}/comments/from-video/${video_id}${prevParams}`
        : null;

    return {
      next,
      prev,
      ...res,
    };
  }

  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(
    @Param('commentId') _id: string,
    @Req() request: Request,
  ) {
    const user_id = request.user['_id'];
    const user = await this.userService.findById(user_id);

    const data = await this.commentService.findOne(_id);
    if (!data) throw new NotFoundException();

    if (data.authorInfos._id !== user_id && user.role !== EUserRole.ADMIN)
      throw new ForbiddenException('Not authorized');

    await this.commentService.delete(_id);
  }

  @Post('/:commentId/like')
  async likeComment(@Param('commentId') _id: string, @Req() request: Request) {
    const user_id = request.user['_id'];
    return await this.commentService.toggleLike(_id, user_id);
  }
}
