import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EUserRole } from 'src/common/enums/user.enums';
import { Dates, DatesSchema } from 'src/common/schemas/date.schema';
import { UserState, UserStateSchema } from './userState.schema';

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  bio: string;

  @Prop()
  avatar: string;

  @Prop({ type: UserStateSchema })
  state: UserState;

  @Prop({ type: String, enum: EUserRole })
  role: EUserRole;

  @Prop({ type: DatesSchema })
  dates: Dates;
}
export const UserSchema = SchemaFactory.createForClass(User);
