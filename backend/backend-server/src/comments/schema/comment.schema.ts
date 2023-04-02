import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Prop({ default: 0 })
  likes: number;
}
export const commentSchema = SchemaFactory.createForClass(Comment);
