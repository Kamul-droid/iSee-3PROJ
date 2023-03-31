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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Dates } from 'src/common/schemas/date.schema';
import { UsersService } from 'src/users/users.service';
import { VideoService } from 'src/videos/video.service';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
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
  @Post('new')
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
  async getVideoComment(@Param('videoId') videoId: string) {
    const comments = await this.commentService.findByVideoId(videoId);
    return comments;
  }
}
