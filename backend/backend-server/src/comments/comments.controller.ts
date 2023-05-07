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
import { FilterQuery } from 'mongoose';
import { EUserRole } from 'src/common/enums/user.enums';
import buildQueryParams from 'src/common/helpers/buildQueryParams';
import { buildSortObject } from 'src/common/helpers/buildSortObject';
import { env } from 'src/env';
import { UsersService } from 'src/users/users.service';
import { VideoService } from 'src/videos/video.service';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { GetCommentsFromVideoDto } from './dto/getCommentsFromVideo.dto';
import { Comment } from './schema/comment.schema';
import { AuthMode, EAuth } from 'src/common/decorators/auth-mode.decorator';

@Controller('comments')
@ApiTags('comments')
@ApiBearerAuth('JWT-auth')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UsersService,
    private readonly videoService: VideoService,
  ) {}

  @Post('')
  async addComment(
    @Query('videoId') videoId: string,
    @Body() req: CommentDto,
    @Req() request: Request,
  ) {
    const id = request.user['_id'];

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
      authorInfos: {
        _id: id,
        username: user.username,
        avatar: user.avatar,
      },
    } as Comment;

    return await this.commentService.create(_comment);
  }

  @Patch(':commentId')
  async updateCommentOnly(
    @Param('commentId') id: string,
    @Body() req: CommentDto,
  ) {
    const data = await this.commentService.update(id, req);
    if (!data) throw new NotFoundException();

    return data;
  }

  @AuthMode(EAuth.OPTIONAL)
  @Get('from-video/:videoId')
  async getVideoComment(
    @Param('videoId') videoId: string,
    @Req() httpRequest: Request,
    @Query() query: GetCommentsFromVideoDto,
  ) {
    const commentsFrom = query.commentsFrom
      ? new Date(query.commentsFrom)
      : new Date();

    const userId = httpRequest.user?.['_id'];

    const filters = {
      createdAt: { $lt: commentsFrom },
      videoid: videoId,
      ...(userId && query.mine && { 'authorInfos._id': userId }),
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

  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() request: Request,
  ) {
    const user_id = request.user['_id'];
    const user = await this.userService.findById(user_id);

    const data = await this.commentService.find(commentId);
    if (!data) throw new NotFoundException();

    if (data.authorInfos._id !== user_id && user.role !== EUserRole.ADMIN)
      throw new ForbiddenException('Not authorized');

    await this.commentService.delete(commentId);
  }

  @Post('/:commentId/like')
  async likeComment(
    @Param('commentId') commentId: string,
    @Req() request: Request,
  ) {
    const userId = request.user['_id'];
    return await this.commentService.toggleLike(commentId, userId);
  }
}
