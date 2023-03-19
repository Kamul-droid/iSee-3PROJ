import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { env } from './env';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { TraceRequestsInterceptor } from './common/interceptors/trace-request.interceptor';
import { TraceExceptionsFilter } from './common/exception-filters/http-exceptions.filter';

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
    MailerModule.forRoot({
      transport: {
        service: env().mailer.service,
        auth: {
          user: env().mailer.email,
          pass: env().mailer.password,
        },
      },
      template: {
        dir: join(__dirname, 'mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    VideosModule,
    CommentsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TraceExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceRequestsInterceptor,
    },
  ],
})
export class AppModule {}
