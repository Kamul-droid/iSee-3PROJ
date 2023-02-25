import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { PickType } from '@nestjs/swagger';
import { User } from './user.schema';

@Schema()
export class ReducedUser extends PickType(User, ['username', 'avatar']) {}
export const ReducedUserSchema = SchemaFactory.createForClass(ReducedUser);
