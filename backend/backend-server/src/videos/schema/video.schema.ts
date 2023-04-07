import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

import {
  ReducedUser,
  ReducedUserSchema,
} from 'src/users/schema/reducedUser.schema';
import { VideoState, videoStateSchema } from './videoState.schema';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Video extends Document {
  @ApiProperty()
  @Prop()
  @IsDefined()
  title: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ default: '' })
  thumbnail: string;

  @ApiProperty()
  @Prop()
  videoPath: string;

  @ApiPropertyOptional()
  @Prop({ type: videoStateSchema, default: new VideoState() })
  state: VideoState;

  @ApiPropertyOptional()
  @Prop({ default: 0 })
  views: number;

  @ApiPropertyOptional()
  @Prop({ default: 0 })
  likes: number;

  @ApiPropertyOptional()
  @Prop({ type: ReducedUserSchema })
  uploaderInfos: ReducedUser;
}
export const videoSchema = SchemaFactory.createForClass(Video);
