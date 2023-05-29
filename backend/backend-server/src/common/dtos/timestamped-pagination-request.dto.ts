import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional } from 'class-validator';
import { ToDate } from '../decorators/to-date.decorator';

export class TimestampedPaginationRequestDto {
  @ApiPropertyOptional()
  @ToDate()
  @IsDate()
  @IsOptional()
  from?: Date;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  pageIdx?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  pageSize?: number;
}
