import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, videoSchema } from './schema/video.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Video.name,
        schema: videoSchema,
      },
    ]),
  ],
})
export class VideosModule {}
