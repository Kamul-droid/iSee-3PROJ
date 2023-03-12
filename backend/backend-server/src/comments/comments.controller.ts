import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Dates } from 'src/common/schemas/date.schema';
import { ReducedUser } from 'src/users/schema/reducedUser.schema';
import { UsersService } from 'src/users/users.service';
import { VideoService } from 'src/videos/video.service';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { CommentUpdateDto } from './dto/comment.update.dto';
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
    @Query('userId') userId: string,
    @Query('videoId') videoId: string,
    @Body() req: CommentDto,
  ) {
    const user = await this.userService.findById(userId);
    const video = await this.videoService
      .getById(new mongoose.Types.ObjectId(videoId))
      .catch((e) => {
        throw new NotFoundException(
          "Bad video Id; We didn't find any video with this Id",
        );
      });

    if (user && video) {
      const _comment = new Comment();
      _comment.videoid = video._id.toString();
      const _authorInfos = {
        _id: userId,
        username: user.username,
        avatar: user.avatar,
      };

      _comment.dates = new Dates();
      _comment.authorInfos = _authorInfos;

      _comment.content = req.content;

      const data = await this.commentService.create(_comment);

      return data;
    }
    if (!user) {
      throw new NotFoundException('You need an account to comment');
    }
    if (!video) {
      throw new NotFoundException('This comment is not attributed to a video ');
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch('update-metadata/:id')
  async updateComment(@Param('id') id: string, @Body() req: CommentUpdateDto) {
    const data = await this.commentService.update(
      new mongoose.Types.ObjectId(id),
      req,
    );
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch('update/:commentId')
  async updateCommentOnly(
    @Param('commentId') id: string,
    @Body() req: CommentDto,
  ) {
    const data = await this.commentService.update(
      new mongoose.Types.ObjectId(id),
      req,
    );
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/:videoId')
  async getVideoComment(@Param('videoId') videoId: string) {
    const comments = await this.commentService.findByVideoId(videoId);
    return comments;
  }
}
