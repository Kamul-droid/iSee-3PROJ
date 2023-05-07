import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import {
  ReducedUser,
  ReducedUserSchema,
} from 'src/users/schema/reducedUser.schema';
import { Document } from 'mongoose';
import { EVideoState } from 'src/common/enums/video.enums';

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
}
export const videoSchema = SchemaFactory.createForClass(Video);
