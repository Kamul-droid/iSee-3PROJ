import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { Dates, DatesSchema } from 'src/common/schemas/date.schema';
import {
  ReducedUser,
  ReducedUserSchema,
} from 'src/users/schema/reducedUser.schema';
import { CommentState, commentStateSchema } from './commentState.schema';

@Schema()
export class Comment {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Prop()
  content: string;

  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId, index: true })
  videoid: string;

  @Prop({ type: commentStateSchema })
  state: CommentState;

  @ApiProperty()
  @Prop({ type: ReducedUserSchema })
  authorInfos: ReducedUser;

  @ApiProperty()
  @Prop({ type: DatesSchema })
  dates: Dates;
}
export const commentSchema = SchemaFactory.createForClass(Comment);
