import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserState {
  @Prop()
  isEmailValidated: boolean;
  @Prop()
  isDeleted: boolean;
  @Prop()
  isBanned: boolean;
}
export const UserStateSchema = SchemaFactory.createForClass(UserState);
