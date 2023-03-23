import { PickType } from '@nestjs/swagger';
import { EVideoVisibility } from 'src/common/enums/video.enums';
import { Video } from '../schema/video.schema';

export class VideoUpdateDto extends PickType(Video, ['title', 'description']) {
  visibility: EVideoVisibility;
}
