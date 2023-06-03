import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false })
export class ReducedUser {
  @Prop({ type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @Prop()
  username: string;

  @Prop()
  avatar: string;
}
export const ReducedUserSchema = SchemaFactory.createForClass(ReducedUser);
