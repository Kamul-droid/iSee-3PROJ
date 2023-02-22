import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Dates, DatesSchema } from 'src/common/schemas/date.schema';
import {
  ReducedUser,
  ReducedUserSchema,
} from 'src/users/schema/reducedUser.schema';
import { VideoState, videoStateSchema } from './videoState.schema';

@Schema()
export class Video {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  thumbnail: string;

  @Prop({ type: videoStateSchema })
  state: VideoState;

  @Prop()
  views: number;

  @Prop({ type: mongoose.Types.ObjectId })
  uploaderId: string;

  @Prop({ type: ReducedUserSchema })
  uploaderInfos: ReducedUser;

  @Prop({ type: DatesSchema })
  dates: Dates;
}
export const videoSchema = SchemaFactory.createForClass(Video);
