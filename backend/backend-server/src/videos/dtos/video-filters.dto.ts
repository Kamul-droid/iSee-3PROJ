import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class VideoFiltersDto {
  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  uploader_id: string;
}
