import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CommentsModule } from './comments/comments.module';
import { env } from './env';
import { RolesGuard } from './users/roles.guard';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { TraceRequestsInterceptor } from './common/interceptors/trace-request.interceptor';
import { TraceExceptionsFilter } from './common/exception-filters/http-exceptions.filter';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: env().jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
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
    AdminDashboardModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TraceExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceRequestsInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
