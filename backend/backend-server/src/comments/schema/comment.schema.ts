import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Dates, DatesSchema } from 'src/common/schemas/date.schema';
import {
  ReducedUser,
  ReducedUserSchema,
} from 'src/users/schema/reducedUser.schema';
import { CommentState, commentStateSchema } from './commentState.schema';

@Schema()
export class Comment {
  @Prop()
  content: string;

  @Prop({ type: mongoose.Types.ObjectId, index: true })
  videoid: string;

  @Prop({ type: commentStateSchema })
  state: CommentState;

  @Prop({ type: mongoose.Types.ObjectId })
  authorId: string;

  @Prop({ type: ReducedUserSchema })
  authorInfos: ReducedUser;

  @Prop({ type: DatesSchema })
  dates: Dates;
}
export const commentSchema = SchemaFactory.createForClass(Comment);
