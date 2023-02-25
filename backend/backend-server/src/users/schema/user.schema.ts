import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsDefined } from 'class-validator';
import { EUserRole } from 'src/common/enums/user.enums';
import { Dates, DatesSchema } from 'src/common/schemas/date.schema';
import { UserState, UserStateSchema } from './userState.schema';

@Schema()
export class User {
  @ApiProperty()
  @Prop()
  @IsDefined()
  username: string;

  @ApiProperty({ default: 'user@test.com' })
  @Prop({ unique: true })
  @IsDefined()
  email: string;

  @ApiProperty()
  @Prop()
  @IsDefined()
  password: string;

  @ApiPropertyOptional()
  @Prop()
  bio?: string;

  @ApiPropertyOptional()
  @Prop()
  avatar?: string;

  @ApiProperty()
  @Prop({ type: UserStateSchema, default: new UserState() })
  state: UserState;

  @ApiProperty({ type: String, enum: EUserRole })
  @Prop({ type: String, enum: EUserRole, default: EUserRole.USER })
  @IsEnum(EUserRole)
  role: EUserRole;

  @Prop({ type: DatesSchema })
  dates: Dates;
}
export const UserSchema = SchemaFactory.createForClass(User);
