import { PartialType } from '@nestjs/swagger';
import { Video } from '../schema/video.schema';

export class UploadVideoDto extends PartialType(Video) {}
