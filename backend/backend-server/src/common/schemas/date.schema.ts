import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ _id: false })
export class Dates {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @ApiPropertyOptional()
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt?: Date;
}
export const DatesSchema = SchemaFactory.createForClass(Dates);
