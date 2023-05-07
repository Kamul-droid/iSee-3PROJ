import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class CreateFakeDto {
  @ApiProperty()
  @IsNumber()
  @IsInt()
  count: number;

  @ApiProperty()
  @IsNumber()
  @IsInt()
  hoursSpread: number;
}
