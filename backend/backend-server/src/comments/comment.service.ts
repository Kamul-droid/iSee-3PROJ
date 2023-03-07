import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CommentDto } from './dto/comment.dto';
import { CommentUpdateDto } from './dto/comment.update.dto';
import { Comment } from './schema/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}
  async create(req: CommentDto): Promise<Comment> {
    const data = new this.commentModel(req);
    const comment = await data.save();
    return comment.toObject();
  }

  async update(
    id: mongoose.Types.ObjectId,
    req: CommentUpdateDto,
  ): Promise<Comment> {
    const data = await this.commentModel
      .findByIdAndUpdate(id, req, { new: true })
      .lean();
    return data;
  }

  async delete(id: mongoose.Types.ObjectId): Promise<Comment> {
    const data = await this.commentModel.findByIdAndDelete(id);
    return data;
  }

  async findByVideoId(videoid: string): Promise<Comment[]> {
    const comment = await this.commentModel.find({ videoid });
    return comment;
  }
}
