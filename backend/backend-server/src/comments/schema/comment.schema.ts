import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose, { Document } from 'mongoose';
import {
  ReducedUser,
  ReducedUserSchema,
} from 'src/users/schema/reducedUser.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Prop()
  content: string;

  @ApiProperty()
  @Prop({ type: mongoose.Types.ObjectId, index: true })
  videoid: string;

  @ApiProperty()
  @Prop({ default: false })
  isEdited: boolean;

  @ApiProperty()
  @Prop({ type: ReducedUserSchema })
  authorInfos: ReducedUser;

  @ApiPropertyOptional()
  @IsOptional()
  @Prop({ default: 0 })
  likes: number;
}
export const commentSchema = SchemaFactory.createForClass(Comment);
