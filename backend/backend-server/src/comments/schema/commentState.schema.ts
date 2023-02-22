import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CommentState {
  @Prop()
  isModified: boolean;

  @Prop()
  isDeleted: boolean;
}
export const commentStateSchema = SchemaFactory.createForClass(CommentState);
