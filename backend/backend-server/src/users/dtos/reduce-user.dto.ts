import { PartialType } from '@nestjs/swagger';
import { ReducedUser } from '../schema/reducedUser.schema';

export class ReducedUserDto extends PartialType(ReducedUser) {}
