import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ValidateSort } from 'src/common/validators/IsProperSortString.decorator';

export class GetCommentsFromVideoDto {
  @ApiProperty({ type: Date })
  @IsDateString()
  commentsFrom: Date;

  @ApiProperty()
  @IsNumberString()
  @IsInt()
  pageSize: number;

  @ApiProperty()
  @IsNumberString()
  @IsInt()
  page: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Validate(ValidateSort)
  sort?: string;
}
