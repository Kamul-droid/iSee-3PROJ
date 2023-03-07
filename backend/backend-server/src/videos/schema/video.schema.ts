import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import mongoose from 'mongoose';
import { Dates, DatesSchema } from 'src/common/schemas/date.schema';
import {
  ReducedUser,
  ReducedUserSchema,
} from 'src/users/schema/reducedUser.schema';
import { VideoState, videoStateSchema } from './videoState.schema';

@Schema()
export class Video {
  @ApiProperty()
  @Prop()
  @IsDefined()
  title: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  thumbnail: string;
  @ApiProperty()
  @Prop()
  videoPath: string;

  @ApiPropertyOptional()
  @Prop({ type: videoStateSchema, default: new VideoState() })
  state: VideoState;

  @ApiPropertyOptional()
  @Prop()
  views: number;

  @ApiPropertyOptional()
  @Prop({ type: ReducedUserSchema, default: new ReducedUser() })
  uploaderInfos: ReducedUser;

  @ApiPropertyOptional()
  @Prop({ type: DatesSchema })
  dates: Dates;
}
export const videoSchema = SchemaFactory.createForClass(Video);
