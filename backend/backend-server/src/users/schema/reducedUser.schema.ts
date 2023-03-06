import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PickType } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema({ _id: false })
export class ReducedUser extends PickType(User, ['username', 'avatar']) {
  @Prop({ type: mongoose.Types.ObjectId })
  authorId: string;
}

export const ReducedUserSchema = SchemaFactory.createForClass(ReducedUser);
