import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { EVideoVisibility } from 'src/common/enums/video.enums';

@Schema({ _id: false })
export class VideoState {
  @ApiProperty()
  @Prop({ type: String, enum: EVideoVisibility })
  visibility: EVideoVisibility;

  @ApiProperty()
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty()
  @Prop({ default: false })
  isBlocked: boolean;
}
export const videoStateSchema = SchemaFactory.createForClass(VideoState);
