import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Dates {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt?: Date;
}
export const DatesSchema = SchemaFactory.createForClass(Dates);
