import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { buildSortObject } from 'src/common/helpers/buildSortObject';
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

  async update(id: string, req: CommentUpdateDto): Promise<Comment> {
    return await this.commentModel
      .findByIdAndUpdate(id, req, { new: true })
      .lean();
  }

  async delete(id: mongoose.Types.ObjectId): Promise<Comment> {
    const data = await this.commentModel.findByIdAndDelete(id);
    return data;
  }

  async findAll(
    filters?: FilterQuery<Comment>,
    pageSize?: number,
    page?: number,
    sort?: string,
  ): Promise<Comment[]> {
    const _page = page || 1;
    const _pageSize = pageSize || 10;
    const _sort = buildSortObject(sort);

    const query = this.commentModel
      .find(filters)
      .sort(_sort)
      .skip((_page - 1) * _pageSize)
      .limit(_pageSize);

    return await query;
  }
}
