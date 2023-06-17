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
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new comment.
   * @param payload
   * @returns
   */
  async create(payload: CommentDto): Promise<Comment> {
    const comment = await this.commentModel.create(payload);
    return comment.toObject();
  }

  /**
   * Updates an existing comment. Sets `isEdited` to true for the frontend.
   * @param _id
   * @param update
   * @returns
   */
  async update(_id: string, update: UpdateQuery<Comment>): Promise<Comment> {
    update.isEdited = true;

    return await this.commentModel
      .findByIdAndUpdate(_id, update, { new: true })
      .lean();
  }

  /**
   * Updates many comments at once based on a filter.
   * @param filter
   * @param update
   */
  async updateMany(filter: any, update: UpdateQuery<Comment>) {
    await this.commentModel.updateMany(filter, update).lean();
  }

  /**
   * Deletes a comment by mongo ID.
   * @param _id
   * @returns
   */
  async delete(_id: string): Promise<Comment> {
    return await this.commentModel.findByIdAndDelete(_id);
  }

  /**
   * Deletes many comments by filter.
   * @param filter
   * @returns
   */
  async deleteMany(filter: any) {
    return await this.commentModel.deleteMany(filter);
  }

  /**
   * Find a comment by mongo ID.
   * @param _id
   * @returns
   */
  async findById(_id: string) {
    return await this.commentModel.findById(_id);
  }

  /**
   * Finds comments based on complex filters.
   * Returns comments with additional calculated data such as the
   * comment's "liked" state.
   * @param filters
   * @param pageSize
   * @param page
   * @param sort
   * @param user_id
   * @returns
   */
  async findAll(
    filters: FilterQuery<Comment>,
    pageSize: number,
    page: number,
    sort: any,
    user_id?: string,
  ): Promise<any> {
    const pipeline = [];

    const user = await this.usersService.findById(user_id);

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

  /**
   * Increments or decrements a comment's like counter based on
   * its presence on the user's `likedComments` list.
   * @param _id
   * @param userId
   * @returns
   */
  async toggleLike(_id: string, userId: string): Promise<Comment> {
    const comment = await this.findById(_id);
    if (!comment) throw new NotFoundException();
    const user = await this.usersService.findById(userId);

    if (user.likedComments.includes(_id)) {
      user.likedComments = user.likedComments.filter((c) => c !== _id);
      comment.$inc('likes', -1);
    } else {
      user.likedComments.push(_id);
      comment.$inc('likes', 1);
    }
    await user.save();
    return await comment.save();
  }
}
