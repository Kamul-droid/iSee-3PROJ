import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { User } from '../schema/user.schema';
import { IsOptional } from 'class-validator';

export class CreateUserDto extends PickType(User, [
  'email',
  'password',
  'username',
] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  isAdmin: boolean;
}
