import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ValidateSort } from 'src/common/validators/IsProperSortString.decorator';

export class GetCommentsFromVideoDto {
  @ApiPropertyOptional({ type: Date })
  @IsDateString()
  @IsOptional()
  commentsFrom?: Date;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  pageSize: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  page: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Validate(ValidateSort)
  sort?: string;
}
