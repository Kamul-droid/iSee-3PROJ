import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CommentState {
  @Prop({ default: false })
  isModified: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}
export const commentStateSchema = SchemaFactory.createForClass(CommentState);
