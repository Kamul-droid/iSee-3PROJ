import { PartialType } from '@nestjs/swagger';
import { User } from '../schema/user.schema';

export class UpdateUserDto extends PartialType(User) {}
