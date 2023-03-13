import { PickType, IntersectionType, PartialType } from '@nestjs/swagger';
import { VideoState } from '../schema/videoState.schema';
import { Video } from '../schema/video.schema';

/**
 * This may look a  bit overengineered but
 * it's great for swagger documentation
 */

class VideoStatePart extends PickType(VideoState, ['visibility']) {}

class UserPart extends PickType(Video, ['title', 'description']) {}

class FullUserUpdateVideoDto extends IntersectionType(
  VideoStatePart,
  UserPart,
) {}

export class UserUpdateVideoDto extends PartialType(FullUserUpdateVideoDto) {}
