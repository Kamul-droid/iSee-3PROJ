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
  async find(commentID: string) {
    // eslint-disable-next-line prettier/prettier
    const data = await this.commentModel.findById(new mongoose.Types.ObjectId(commentID));
    return data;
  }

  async findAll(
    filters: FilterQuery<Comment>,
    pageSize: number,
    page: number,
    sort: any,
  ): Promise<any> {
    const query = this.commentModel.find(filters).sort(sort);
    const paginatedQuery = query
      .clone()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      data: await paginatedQuery,
      total: await query.count(),
    };

    // const pipeline = [];

    // if (authorId) {
    //   sort = { isMine: -1, ...sort };
    //   pipeline.push({
    //     $addFields: {
    //       isMine: {
    //         $cond: [
    //           { $eq: ['$comment.authorInfos._id', authorId] },
    //           false,
    //           true,
    //         ],
    //       },
    //     },
    //   });
    // }

    // if (Object.keys(sort).length) {
    //   pipeline.push({ $sort: sort });
    // }

    // pipeline.push(
    //   { $match: filters },
    //   {
    //     $facet: {
    //       metadata: [{ $count: 'total' }],
    //       data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
    //     },
    //   },
    // );

    // const data = await this.commentModel.aggregate(pipeline);

    // return {
    //   data: data[0]?.data,
    //   total: data[0]?.metadata[0]?.total,
    // };
  }
}
