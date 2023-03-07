import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class CommentState {
  @ApiProperty()
  @Prop({ default: false })
  isEdited: boolean;
  @ApiProperty()
  @Prop({ default: false })
  isDeleted: boolean;
}
export const commentStateSchema = SchemaFactory.createForClass(CommentState);
