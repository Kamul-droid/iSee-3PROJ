import { PickType } from '@nestjs/swagger';
import { Video } from '../schema/video.schema';

export class VideoUpdateDto extends PickType(Video, [
  'title',
  'description',
  'state',
  'dates',
]) {}
