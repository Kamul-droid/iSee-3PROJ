import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { VideosModule } from 'src/videos/videos.module';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment, commentSchema } from './schema/comment.schema';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    VideosModule,
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: commentSchema,
      },
    ]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
