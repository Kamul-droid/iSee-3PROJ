import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from './schema/video.schema';
import mongoose, { Model } from 'mongoose';
import { UploadVideoDto } from './dtos/upload-video.dto';
import { EVideoVisibility } from 'src/common/enums/video.enums';

@Injectable()
export class VideoService {
  getPublicAll() {
    throw new Error('Method not implemented.');
  }
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

  async getAll(): Promise<Video[]> {
    return await this.videoModel.find();
  }

  async getAllVideoWithVisibility(query: EVideoVisibility): Promise<Video[]> {
    return await this.videoModel.find({
      'state.visibility': query,
    });
  }
  async findAllByUserId(uploaderInfos) {
    return await this.videoModel.find({ uploaderInfos }).lean();
  }

  async getById(id: mongoose.Types.ObjectId) {
    const video = await this.videoModel.findById(id);
    return video;
  }

  async search(query: string): Promise<Video[]> {
    const filter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
      $and: [{ 'state.visibility': EVideoVisibility.PUBLIC }],
    };
    const res = await this.videoModel.find(filter).exec();
    return res;
  }
}
