import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Dates {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}
export const DatesSchema = SchemaFactory.createForClass(Dates);
