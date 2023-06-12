import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { EVideoProcessing, EVideoState } from 'src/common/enums/video.enums';
import { DEFAULT_VIDEO } from 'src/ensure-default-files';
import {
  ReducedUser,
  ReducedUserSchema,
} from 'src/users/schema/reducedUser.schema';

export type VideoDocument = HydratedDocument<Video>;

@Schema({ timestamps: true })
export class Video {
  @ApiProperty()
  @Prop({ default: '' })
  @IsDefined()
  title: string;

  @ApiProperty()
  @Prop({ default: '' })
  description: string;

  @ApiProperty()
  @Prop({ default: '' })
  thumbnail: string;

  @ApiProperty()
  @Prop({ default: DEFAULT_VIDEO })
  videoPath: string;

  @ApiProperty()
  @Prop({ type: String, enum: EVideoState })
  state: EVideoState;

  @ApiPropertyOptional()
  @Prop({ default: 0 })
  views: number;

  @ApiPropertyOptional()
  @Prop({ default: 0 })
  size: number;

  @ApiPropertyOptional()
  @Prop({ default: 0 })
  likes: number;

  @ApiPropertyOptional()
  @Prop({ type: ReducedUserSchema })
  uploaderInfos: ReducedUser;

  @ApiPropertyOptional()
  @Prop({
    type: String,
    enum: EVideoProcessing,
    default: EVideoProcessing.NOT_STARTED,
  })
  processing: EVideoProcessing;
}
export const videoSchema = SchemaFactory.createForClass(Video);
