import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { Request } from 'express';
import mongoose from 'mongoose';
import { EUserRole } from 'src/common/enums/user.enums';
import { EVideoProcessing, EVideoState } from 'src/common/enums/video.enums';
import { Roles } from 'src/users/roles.decorator';
import { UsersService } from 'src/users/users.service';
import { VideosService } from 'src/videos/videos.service';
import { CreateFakeDto } from './create-fake-users.dto';
import {
  DEFAULT_AVATAR,
  DEFAULT_THUMBNAIL,
  DEFAULT_VIDEO,
} from 'src/ensure-default-files';

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et cursus nisl, at porta sem. Cras lorem eros, porttitor ut lobortis ut, laoreet eu enim. Quisque ut sapien eleifend, lobortis ipsum quis, sodales dui. Aliquam consequat tincidunt nisi, eget lacinia nisi blandit at. Ut egestas, turpis nec lobortis semper, diam elit fermentum orci, eget fermentum odio elit quis massa. Integer posuere orci at nisi lacinia, nec semper ex elementum. Ut facilisis tortor sit amet magna malesuada, a sollicitudin augue pretium.
Etiam sollicitudin at turpis eget semper. Curabitur interdum nisl eget quam tincidunt, et consectetur ipsum cursus. Etiam pulvinar diam elit, luctus ultrices lacus imperdiet condimentum. Nulla imperdiet interdum dui, vitae posuere magna condimentum quis. Vestibulum rutrum semper semper. Fusce ultrices laoreet blandit. In faucibus volutpat risus, vitae fermentum nisi.
Fusce vulputate lectus id sagittis elementum. Morbi egestas nisi enim, ut bibendum velit finibus eu. Pellentesque gravida varius tellus vel tincidunt. In euismod diam ut nisl dapibus aliquam. Duis consectetur vitae sem vel sodales. Aliquam dapibus at sem quis porta. Nam blandit ut elit eu mattis. Duis nisi arcu, vehicula ac convallis ac, bibendum in sapien. Nunc mattis felis quis massa aliquet, ac facilisis sapien consequat. Cras et tincidunt elit, sollicitudin malesuada diam. Nam aliquam lacus diam. Cras quis elit sapien. Quisque ultricies leo id arcu laoreet, eu efficitur ante dictum. Cras mollis vel ipsum vel tincidunt. 
`;

@ApiTags('admin-dashboard')
@Controller('admin-dashboard')
@ApiBearerAuth('JWT-auth')
@Roles(EUserRole.ADMIN)
export class AdminDashboardController {
  constructor(
    private readonly usersService: UsersService,
    private readonly videosService: VideosService,
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
  async createFakeUsers(@Body() body: CreateFakeDto) {
    const users = [];
    for (let index = 0; index < body.count; index++) {
      const id = new mongoose.Types.ObjectId();
      const name = 'fakeUser' + id;
      users.push({
        _id: id,
        username: name,
        email: `${name}@fake.com`,
        avatar: DEFAULT_AVATAR,
        bio: lorem,
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
  async createFakeVideos(
    @Body() body: CreateFakeDto,
    @Req() httpRequest: Request,
  ) {
    const user = await this.usersService.findById(httpRequest.user['_id']);
    const videos = [];
    for (let index = 0; index < body.count; index++) {
      const id = new mongoose.Types.ObjectId();
      const name = 'fake Video ' + id;
      videos.push({
        _id: id,
        title: name,
        description: lorem,
        videoPath: DEFAULT_VIDEO.split('.')[0],
        thumbnail: DEFAULT_THUMBNAIL,
        state: EVideoState.PUBLIC,
        processing: EVideoProcessing.NOT_STARTED,
        size: randomInt(1000, 1000 * 1000 * 100),
        views: randomInt(1000000),
        likes: randomInt(100000),
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
    await this.videosService.deleteMany({ videoPath: DEFAULT_VIDEO });
  }
}
