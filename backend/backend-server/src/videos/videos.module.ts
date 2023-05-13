import { CacheModule } from '@nestjs/cache-manager';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express/multer';
import { UsersModule } from 'src/users/users.module';
import { Video, videoSchema } from './schema/video.schema';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: Video.name,
        schema: videoSchema,
      },
    ]),
    MulterModule.register({
      dest: '/uploads',
    }),
  ],
  providers: [VideoService],
  controllers: [VideoController],
  exports: [VideoService],
})
export class VideosModule {}
