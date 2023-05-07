import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Request } from 'express';
import mongoose from 'mongoose';
import { EUserRole } from 'src/common/enums/user.enums';
import { EVideoState } from 'src/common/enums/video.enums';
import { Roles } from 'src/users/roles.decorator';
import { UsersService } from 'src/users/users.service';
import { VideoService } from 'src/videos/video.service';
import { CreateFakeDto } from './create-fake-users.dto';

@ApiTags('admin-dashboard')
@Controller('admin-dashboard')
@ApiBearerAuth('JWT-auth')
@Roles(EUserRole.ADMIN)
export class AdminDashboardController {
  constructor(
    private readonly usersService: UsersService,
    private readonly videosService: VideoService,
  ) {}

  @Get()
  async getAdminDashboardInfos() {
    const usersList = await this.usersService.find({}, { createdAt: 1 });
    const videosList = await this.videosService.find(
      {},
      { createdAt: 1, size: 1 },
    );

    return { usersList, videosList };
  }

  @Post('create-fake-users')
  async createFakeVideos(@Body() body: CreateFakeDto) {
    const users = [];
    for (let index = 0; index < body.count; index++) {
      const id = new mongoose.Types.ObjectId();
      const name = 'fakeUser' + id;
      users.push({
        _id: id,
        username: name,
        email: `${name}@fake.com`,
        password:
          '$2b$10$O4nbtC5GcSEXjLYx91.8PeQ4acon5Vi6M2/U1Yfl4RQMKySJyP.NS',
        role: 'user',
        createdAt: new Date(
          new Date().getTime() - 1000 * 3600 * randomInt(body.hoursSpread),
        ),
      });
    }

    await this.usersService.createMany(users);
  }

  @Post('create-fake-videos')
  async createFakeUsers(
    @Body() body: CreateFakeDto,
    @Req() httpRequest: Request,
  ) {
    const user = await this.usersService.findById(httpRequest.user['_id']);
    const videos = [];
    for (let index = 0; index < body.count; index++) {
      const id = new mongoose.Types.ObjectId();
      const name = 'fakeVideo' + id;
      videos.push({
        _id: id,
        title: name,
        description: '',
        videoPath: 'fakeVideo',
        state: EVideoState.UNLISTED,
        size: randomInt(1000, 1000 * 1000 * 100),
        createdAt: new Date(
          new Date().getTime() - 1000 * 3600 * randomInt(body.hoursSpread),
        ),
        uploaderInfos: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
        },
      });
    }

    await this.videosService.createMany(videos);
  }

  @Delete('clear-fake-data')
  async DeleteFakeUsers() {
    await this.usersService.deleteMany({ email: /@fake.com$/ });
    await this.videosService.deleteMany({ videoPath: 'fakeVideo' });
  }
}
