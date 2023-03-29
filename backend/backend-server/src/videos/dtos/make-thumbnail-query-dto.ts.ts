import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class MakeThumbnailDto {
  @ApiPropertyOptional()
  @IsOptional()
  timecode: string;
}
