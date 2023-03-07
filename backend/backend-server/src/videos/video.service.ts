import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from './schema/video.schema';
import mongoose, { Model } from 'mongoose';
import { UploadVideoDto } from './dtos/upload-video.dto';

@Injectable()
export class VideoService {
  constructor(@InjectModel(Video.name) private videoModel: Model<Video>) {}

  async create(req: UploadVideoDto): Promise<Video> {
    const data = new this.videoModel(req);
    const video = await data.save();
    return video.toObject();
  }

  async update(id: mongoose.Types.ObjectId, req: UploadVideoDto) {
    const data = await this.videoModel
      .findByIdAndUpdate(id, req, { new: true })
      .lean();

    return data;
  }

  async deleteVideoById(id: mongoose.Types.ObjectId) {
    const video = await this.videoModel.findByIdAndDelete(id);
    return video;
  }

  async getAll() {
    return await this.videoModel.find().lean();
  }

  async getById(id: mongoose.Types.ObjectId) {
    const video = await this.videoModel.findById(id);
    return video;
  }
}
