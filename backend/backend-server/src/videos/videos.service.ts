import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import mongoose, {
  FilterQuery,
  Model,
  ProjectionType,
  UpdateQuery,
} from 'mongoose';
import { EVideoState } from 'src/common/enums/video.enums';
import {
  STATIC_PATH_THUMBNAILS,
  STATIC_PATH_VIDEOS,
} from 'src/ensure-static-paths';
import { UsersService } from 'src/users/users.service';
import { UploadVideoDto } from './dtos/upload-video.dto';
import { Video } from './schema/video.schema';
import ffmpeg = require('fluent-ffmpeg');
import { TimestampedPaginationRequestDto } from 'src/common/dtos/timestamped-pagination-request.dto';
import buildQueryParams from 'src/common/helpers/buildQueryParams';
import { DEFAULT_THUMBNAIL, DEFAULT_VIDEO } from 'src/ensure-default-files';

@Injectable()
export class VideosService {
  getPublicAll() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  /**
   * Uploads the video file to server storage, creating the object in database
   * in draft state.
   * @param uploaderId
   * @param file
   * @returns
   */
  async uploadVideoFile(uploaderId: string, file: Express.Multer.File) {
    const videoName = `${file.filename}.${file.mimetype.split('/').pop()}`;
    const videoPath = `${STATIC_PATH_VIDEOS}/${videoName}`;

    fs.copyFileSync(file.path, videoPath);
    fs.unlinkSync(file.path);

    const user = await this.usersService.findById(uploaderId);
    const video: Partial<Video> = {
      uploaderInfos: {
        _id: user._id,
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

  /**
   * Gets a video from the database while performing basic checks
   * @param videoId
   * @param checkUserId
   * @returns
   */
  private async getVideoWithChecks(videoId: string, checkUserId?: string) {
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

  /**
   * Sets a thumbnail from a portion of the video.
   * Accepted timecode formats are percentiles (50%) and timecodes (01:10.000).
   * @param userId
   * @param videoId
   * @param timecode
   * @returns
   */
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
      video.thumbnail !== DEFAULT_THUMBNAIL &&
      fs.existsSync(`${STATIC_PATH_THUMBNAILS}/${video.thumbnail}`)
    ) {
      console.log('found Old thumbnail file, deleting...');
      fs.unlinkSync(`${STATIC_PATH_THUMBNAILS}/${video.thumbnail}`);
    }

    video.thumbnail = thumbnailName;
    return await video.save();
  }

  /**
   * Creates a video in database.
   * @param req
   * @returns
   */
  async create(req: UploadVideoDto): Promise<Video & { _id }> {
    const data = new this.videoModel(req);
    const video = await data.save();
    return video.toObject();
  }

  /**
   * Updates a video in database.
   * @param id
   * @param req
   * @returns
   */
  async update(id: string, req: any) {
    return await this.videoModel.findByIdAndUpdate(id, req, {
      new: true,
    });
  }

  /**
   * Updates many videos at once based on a filter.
   * @param filter
   * @param update
   */
  async updateMany(filter: any, update: UpdateQuery<Video>) {
    await this.videoModel.updateMany(filter, update);
  }

  /**
   * Finds a single video by mongo ID.
   * @param id
   * @returns
   */
  async findOneById(id: string) {
    return await this.videoModel.findById(id);
  }

  /**
   * Deletes a single video by mongo ID.
   * @param id
   * @returns
   */
  async deleteVideoById(id: string) {
    const video = await this.videoModel.findByIdAndDelete(id);
    return video;
  }

  /**
   * Finds many videos based on complex filters.
   * @param filter
   * @param select
   * @returns
   */
  async find(
    filter?: FilterQuery<Video>,
    select?: ProjectionType<Video>,
  ): Promise<Video[]> {
    return await this.videoModel.find(filter, select);
  }

  async findPaginated(
    from: Date,
    pageIdx: number,
    pageSize: number,
    filter?: FilterQuery<Video>,
    select?: ProjectionType<Video>,
  ) {
    filter.createdAt = { $lt: from };
    const data = await this.videoModel
      .find(filter, select)
      .sort('-createdAt')
      .skip(pageSize * pageIdx)
      .limit(pageSize);
    const total = await this.videoModel.count(filter);

    return { data, total };
  }

  /**
   * [For testing purposes] Creates many videos at once.
   * @param videos
   */
  async createMany(videos: Video[]) {
    await this.videoModel.insertMany(videos);
  }

  /**
   * [For testing purposes] Deletes many videos at once based on a filter.
   * @param filter
   */
  async deleteMany(filter: FilterQuery<Video>) {
    await this.videoModel.deleteMany(filter);
  }

  /**
   * Gets a user's own videos without additional filters.
   * @param userId
   * @returns
   */
  async getMyVideos(userId: string): Promise<Video[]> {
    return await this.videoModel.find({ 'uploaderInfos._id': userId });
  }

  /**
   * Gets a single video by ID.
   * @param id
   * @returns
   */
  async getById(id: string) {
    const video = await this.videoModel.findById(id);
    return video;
  }

  /**
   * Searches videos based on title and description.
   * @param query
   * @returns
   */
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

  /**
   * Increments a video's view counter
   * @param videoId
   */
  async addView(videoId: string) {
    await this.videoModel.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
  }

  /**
   * Deletes a video file on storage, changing its state in the process
   * @param id
   * @param userId
   * @returns
   */
  async deleteVideoFile(id: string, userId: string) {
    const video = await this.getVideoWithChecks(id, userId);

    if (video.videoPath !== DEFAULT_VIDEO) {
      fs.unlinkSync(`${STATIC_PATH_VIDEOS}/${video.videoPath}`);
    }

    video.videoPath = '';
    video.state = EVideoState.DELETED;

    return await video.save();
  }

  async count(filter: FilterQuery<Video>) {
    return await this.videoModel.count(filter);
  }
}
