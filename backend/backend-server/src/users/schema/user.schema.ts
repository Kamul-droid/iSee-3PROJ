import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEnum } from 'class-validator';
import { EUserRole } from 'src/common/enums/user.enums';
import { UserState, UserStateSchema } from './userState.schema';
import { HydratedDocument } from 'mongoose';
import { DEFAULT_AVATAR } from 'src/ensure-default-files';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  @Prop({ unique: true })
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
  @Prop({ default: '' })
  bio: string;

  @ApiPropertyOptional()
  @Prop({ default: DEFAULT_AVATAR })
  avatar: string;

  @ApiPropertyOptional()
  @Prop({ type: [String], default: [] })
  likedComments: string[];

  @ApiProperty()
  @Prop({ type: UserStateSchema, default: new UserState() })
  state: UserState;

  @ApiProperty({ type: String, enum: EUserRole })
  @Prop({ type: String, enum: EUserRole, default: EUserRole.USER })
  @IsEnum(EUserRole)
  role: EUserRole;
}
export const UserSchema = SchemaFactory.createForClass(User);
