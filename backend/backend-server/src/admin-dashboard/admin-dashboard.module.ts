import { Module } from '@nestjs/common';
import { AdminDashboardController } from './admin-dashboard.controller';
import { UsersModule } from 'src/users/users.module';
import { VideosModule } from 'src/videos/videos.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/env';

@Module({
  imports: [
    UsersModule,
    VideosModule,
    JwtModule.register({
      secret: env().jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AdminDashboardController],
})
export class AdminDashboardModule {}
