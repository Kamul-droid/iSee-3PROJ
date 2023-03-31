import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CommentsModule } from './comments/comments.module';
import { env } from './env';
import { RolesGuard } from './users/roles.guard';
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
    ChatModule,
  ],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: TraceExceptionsFilter,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TraceRequestsInterceptor,
    // },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
