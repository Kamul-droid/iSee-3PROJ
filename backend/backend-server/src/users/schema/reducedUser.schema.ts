import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ReducedUser {
  @Prop()
  username: string;

  @Prop()
  avatar: string;
}
export const ReducedUserSchema = SchemaFactory.createForClass(ReducedUser);
