import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { env } from './env';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';

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
    AuthModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
