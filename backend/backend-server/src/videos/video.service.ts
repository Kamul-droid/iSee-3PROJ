import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { FilterQuery, Model, ProjectionType, UpdateQuery } from 'mongoose';
import { EVideoState } from 'src/common/enums/video.enums';
import {
  STATIC_PATH_THUMBNAILS,
  STATIC_PATH_VIDEOS,
} from 'src/init-static-paths';
import { UsersService } from 'src/users/users.service';
import { UploadVideoDto } from './dtos/upload-video.dto';
import { Video } from './schema/video.schema';
import ffmpeg = require('fluent-ffmpeg');

@Injectable()
export class VideoService {
  getPublicAll() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async uploadVideoFile(uploaderId: string, file: Express.Multer.File) {
    const videoName = `${file.filename}.${file.mimetype.split('/').pop()}`;
    const videoPath = `${STATIC_PATH_VIDEOS}/${videoName}`;

    fs.copyFileSync(file.path, videoPath);
    fs.unlinkSync(file.path);

    const user = await this.usersService.findById(uploaderId);
    const video: Partial<Video> = {
      uploaderInfos: {
        _id: uploaderId,
        username: user.username,
        avatar: user.avatar,
      },
      videoPath: videoName,
      size: file.size,
      state: EVideoState.DRAFT,
    };
    const { _id } = await this.create(video);
    const videoWithThumbnail = this.makeThumbnail(uploaderId, _id, '50%');
    return videoWithThumbnail;
  }

  async getVideoWithChecks(videoId: string, checkUserId?: string) {
    const video = await this.getById(videoId);

    if (video === null) {
      throw new NotFoundException('This video does not exist');
    }

    if (
      checkUserId !== undefined &&
      video.uploaderInfos._id.toString() !== checkUserId.toString()
    ) {
      throw new ForbiddenException('This video does not belong to you');
    }

    return video;
  }

  async makeThumbnail(userId: string, videoId: string, timecode: string) {
    const video = await this.getVideoWithChecks(videoId, userId);
    const thumbnailName = `${video.videoPath}_thumb${new Date().getTime()}.jpg`;

    await new Promise((resolve, reject) => {
      ffmpeg(`${STATIC_PATH_VIDEOS}/${video.videoPath}`)
        // setup event handlers
        .on('end', function () {
          console.log(
            `thumbnail created for video ${video.videoPath} at ${timecode}`,
          );
          resolve('ok');
        })
        .on('error', function (err) {
          return reject(err);
        })
        .screenshot(
          {
            count: 1,
            timemarks: [timecode],
            filename: thumbnailName,
            size: '640x360',
          },
          STATIC_PATH_THUMBNAILS,
        );
    });

    if (
      video.thumbnail &&
      fs.existsSync(`${STATIC_PATH_THUMBNAILS}/${video.thumbnail}`)
    ) {
      console.log('found Old thumbnail file, deleting...');
      fs.unlinkSync(`${STATIC_PATH_THUMBNAILS}/${video.thumbnail}`);
    }

    video.thumbnail = thumbnailName;
    return await video.save();
  }

  async create(req: UploadVideoDto): Promise<Video & { _id }> {
    const data = new this.videoModel(req);
    const video = await data.save();
    return video.toObject();
  }

  async update(id: string, req: any) {
    return await this.videoModel.findByIdAndUpdate(id, req, {
      new: true,
    });
  }

  async updateMany(filter: any, update: UpdateQuery<Video>) {
    await this.videoModel
      .updateMany(filter, update)
      .catch((err) =>
        console.log('Error occured during update many process:' + err),
      );
  }

  async findOneById(id: string) {
    return await this.videoModel.findById(id);
  }

  async deleteVideoById(id: string) {
    const video = await this.videoModel.findByIdAndDelete(id);
    return video;
  }

  async find(
    filter?: FilterQuery<Video>,
    select?: ProjectionType<Video>,
  ): Promise<Video[]> {
    return await this.videoModel.find(filter, select);
  }

  async createMany(videos: Video[]) {
    await this.videoModel.insertMany(videos);
  }

  async deleteMany(filter: FilterQuery<Video>) {
    await this.videoModel.deleteMany(filter);
  }

  async getMyVideos(userId: string): Promise<Video[]> {
    return await this.videoModel.find({ 'uploaderInfos._id': userId });
  }

  async getById(id: string) {
    const video = await this.videoModel.findById(id);
    return video;
  }

  async search(query: string): Promise<Video[]> {
    const filter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
      $and: [{ state: EVideoState.PUBLIC }],
    };
    const res = await this.videoModel.find(filter).exec();
    return res;
  }

  async addView(videoId: string) {
    await this.videoModel.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
  }

  async deleteVideoFile(id: string, userId: string) {
    const video = await this.getVideoWithChecks(id, userId);

    fs.unlinkSync(`${STATIC_PATH_VIDEOS}/${video.videoPath}`);

    video.videoPath = '';
    video.state = EVideoState.DELETED;

    return await video.save();
  }
}
