import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { EVideoState } from 'src/common/enums/video.enums';
import { UsersService } from 'src/users/users.service';
import { UploadVideoDto } from './dtos/upload-video.dto';
import { Video } from './schema/video.schema';

@Injectable()
export class VideoService {
  getPublicAll() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  async uploadVideoFile(uploaderId: string, filePath: string) {
    const user = await this.usersService.findById(uploaderId);
    const video: Partial<Video> = {
      uploaderInfos: {
        _id: uploaderId,
        username: user.username,
        avatar: user.avatar,
      },
      videoPath: filePath,
      state: EVideoState.DRAFT,
    };
    const { _id } = await this.create(video);
    const videoWithThumbnail = this.makeThumbnail(uploaderId, _id, '50%');
    return videoWithThumbnail;
  }

  async userOwnsVideoCheck(userId: string, videoId) {
    const video = await this.getById(videoId);

    if (video.uploaderInfos._id !== userId) {
      throw new ForbiddenException('This video does not belong to you');
    }
  }

  async makeThumbnail(uploaderId: string, videoId: string, timecode: string) {
    const video = await this.findOneById(videoId);

    if (video === null) {
      throw new NotFoundException('This video does not exist');
    }

    if (video.uploaderInfos._id !== uploaderId) {
      throw new ForbiddenException(
        'You cannot modify the thumbnail of a video that is not yours',
      );
    }

    let url = `http://isee-nginx/make-thumbnail/${video.videoPath}`;
    if (timecode) {
      url += `?timecode=${encodeURIComponent(timecode)}`;
    }

    const data = await firstValueFrom(this.httpService.post(url))
      .catch((e) => {
        console.error(e);
        throw new InternalServerErrorException('Failed to save thumbnail');
      })
      .then((data) => data.data);

    const thumbnailPath = data['thumbnail'].split('thumbnails/')[1];
    video.thumbnail = thumbnailPath;

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

  async updateBatch(filter: FilterQuery<Video>, update: UpdateQuery<Video>) {
    return await this.videoModel.updateMany(filter, update);
  }

  async findOneById(id: string) {
    return await this.videoModel.findById(id);
  }

  async deleteVideoById(id: string) {
    const video = await this.videoModel.findByIdAndDelete(id);
    return video;
  }

  async findAll(filter: FilterQuery<Video>): Promise<Video[]> {
    return await this.videoModel.find(filter);
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
}
