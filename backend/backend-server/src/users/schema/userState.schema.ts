import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class UserState {
  @ApiProperty()
  @Prop({ default: false })
  isEmailValidated: boolean;

  @ApiProperty()
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty()
  @Prop({ default: false })
  isBanned: boolean;
}
export const UserStateSchema = SchemaFactory.createForClass(UserState);
