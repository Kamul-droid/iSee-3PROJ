import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './schema/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  async create(req: CommentDto): Promise<Comment> {
    const data = new this.commentModel(req);
    const comment = await data.save();
    return comment.toObject();
  }

  async update(id: string, req: UpdateQuery<Comment>): Promise<Comment> {
    return await this.commentModel
      .findByIdAndUpdate(id, req, { new: true })
      .lean();
  }

  async updateMany(filter: any, req: UpdateQuery<Comment>) {
    await this.commentModel
      .updateMany(filter, req)
      .catch((err) =>
        console.log('Error occured during update many process:' + err),
      );
  }

  async delete(id: string): Promise<Comment> {
    return await this.commentModel.findByIdAndDelete(id);
  }

  async deleteMany(filter: any) {
    return await this.commentModel.deleteMany(filter);
  }

  async find(commentId: string) {
    return await this.commentModel.findById(commentId);
  }

  async findAll(
    filters: FilterQuery<Comment>,
    pageSize: number,
    page: number,
    sort: any,
    userId?: string,
  ): Promise<any> {
    // const query = this.commentModel.find(filters).sort(sort);
    // const paginatedQuery = query
    //   .clone()
    //   .skip((page - 1) * pageSize)
    //   .limit(pageSize);

    // return {
    //   data: await paginatedQuery,
    //   total: await query.count(),
    // };

    const pipeline = [];

    const user = await this.usersService.findById(userId);

    const isLiked = user
      ? {
          $in: [
            '$_id',
            user.likedComments.map((o) => new mongoose.Types.ObjectId(o)),
          ],
        }
      : false;

    pipeline.push({
      $addFields: {
        isLiked: isLiked,
      },
    });

    if (Object.keys(sort).length) {
      pipeline.push({ $sort: sort });
    }

    pipeline.push(
      { $match: filters },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    );

    const data = await this.commentModel.aggregate(pipeline);

    return {
      data: data[0]?.data,
      total: data[0]?.metadata[0]?.total,
    };
  }

  async toggleLike(commentId: string, userId: string): Promise<Comment> {
    const comment = await this.find(commentId);
    if (!comment) throw new NotFoundException();
    const user = await this.usersService.findById(userId);

    if (user.likedComments.includes(commentId)) {
      user.likedComments = user.likedComments.filter((c) => c !== commentId);
      comment.$inc('likes', -1);
    } else {
      user.likedComments.push(commentId);
      comment.$inc('likes', 1);
    }
    await user.save();
    return await comment.save();
  }
}
