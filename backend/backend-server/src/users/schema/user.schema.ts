import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EUserRole } from 'src/common/enums/user.enums';
import { Dates, DatesSchema } from 'src/common/schemas/date.schema';
import { UserState, UserStateSchema } from './userState.schema';

@Schema()
export class User {
  @ApiProperty()
  @Prop()
  username: string;

  @ApiProperty({ default: 'user@test.com' })
  @Prop({ unique: true })
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiPropertyOptional()
  @Prop()
  bio?: string;

  @ApiPropertyOptional()
  @Prop()
  avatar?: string;

  @ApiProperty()
  @Prop({ type: UserStateSchema })
  state: UserState;

  @ApiProperty({ type: String, enum: EUserRole })
  @Prop({ type: String, enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;

  @Prop({ type: DatesSchema })
  dates: Dates;
}
export const UserSchema = SchemaFactory.createForClass(User);
