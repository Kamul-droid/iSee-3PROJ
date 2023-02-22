import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { env } from './env';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      [
        'mongodb://',
        env().mongodb.user,
        ':',
        env().mongodb.pass,
        '@',
        env().mongodb.host,
        ':',
        env().mongodb.port,
        '/',
        env().mongodb.collection,
        '?authSource=admin',
      ].join(''),
    ),
    UsersModule,
    VideosModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
