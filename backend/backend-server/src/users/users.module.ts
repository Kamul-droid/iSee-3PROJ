import { CacheModule } from '@nestjs/cache-manager';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { VideosModule } from 'src/videos/videos.module';
import { User, UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    forwardRef(() => VideosModule),
    forwardRef(() => CommentsModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MulterModule.register({
      dest: '/uploads',
    }),
    CacheModule.register(),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
