import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  isBoolean,
  IsDate,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ValidateSort } from 'src/common/validators/IsProperSortString.decorator';

export class GetCommentsFromVideoDto {
  @ApiPropertyOptional()
  // @IsDateString()
  @IsOptional()
  commentsFrom?: string;

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

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  mine?: boolean;
}
