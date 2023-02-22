import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EVideoVisibility } from 'src/common/enums/video.enums';

@Schema()
export class VideoState {
  @Prop({ type: String, enum: EVideoVisibility })
  visibility: EVideoVisibility;

  @Prop()
  isDeleted: boolean;

  @Prop()
  isBlocked: boolean;
}
export const videoStateSchema = SchemaFactory.createForClass(VideoState);
