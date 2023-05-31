import { PickType } from '@nestjs/swagger';
import { Video } from '../schema/video.schema';

export class UserUpdateVideoDto extends PickType(Video, [
  'title',
  'description',
  'state',
]) {}
