import { Module } from '@nestjs/common';
import { AdminDashboardController } from './admin-dashboard.controller';
import { UsersModule } from 'src/users/users.module';
import { VideosModule } from 'src/videos/videos.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, VideosModule, JwtModule],
  controllers: [AdminDashboardController],
})
export class AdminDashboardModule {}
