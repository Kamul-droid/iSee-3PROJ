import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotAcceptableException,
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
import { EUserRole } from 'src/common/enums/user.enums';

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
    @Req() httpRequest: Request,
    @Query() query: GetCommentsFromVideoDto,
  ) {
    console.log(query);

    const commentsFrom = query.commentsFrom
      ? new Date(query.commentsFrom)
      : new Date();

    const filters = {
      'dates.createdAt': { $lt: commentsFrom },
      videoid: videoId,
    } as FilterQuery<Comment>;

    if (query.mine && httpRequest.user) {
      filters['authorInfos._id'] = httpRequest.user['_id'];
    }

    console.log();

    const page = query.page || 1;
    const pageSize = query.pageSize || 5;
    const sort = buildSortObject(query.sort);

    const res = await this.commentService.findAll(
      filters,
      pageSize,
      page,
      sort,
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete('from-video/:commentID')
  async deleteComment(
    @Query('commentID') commentID: string,

    @Req() request: Request,
  ) {
    //get user from auth
    const user_id = request.user['_id'];
    const user = await this.userService.findById(user_id);
    const user_role = user.role;
    //check if it is user comment
    const data = await this.commentService.find(commentID);
    if (!data) throw new NotFoundException();
    // delete comment if user or admin
    if (user_role == EUserRole.ADMIN)
      return await this.commentService.delete(data._id);
    if (data.authorInfos._id != user_id)
      throw new NotAcceptableException('Not authorized');

    return await this.commentService.delete(data._id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete('from-video/:commentID')
  async commentLikes(
    @Query('commentID') commentID: string,

    @Req() request: Request,
  ) {
    const user_id = request.user['_id'];
    const user = await this.userService.findById(user_id);

    if (user.likedComments.includes(commentID)) {
      const commentData = await this.commentService.find(commentID);
      commentData.likes -= 1;
      user.likedComments = user.likedComments.filter(
        (item) => item != commentID,
      );
      await this.commentService.update(commentID, commentData);
      await this.userService.update(user_id, user);

      return commentData.likes;
    }

    const commentData = await this.commentService.find(commentID);
    commentData.likes += 1;
    user.likedComments.push(commentID);

    await this.commentService.update(commentID, commentData);
    await this.userService.update(user_id, user);

    return commentData.likes;
  }
}
