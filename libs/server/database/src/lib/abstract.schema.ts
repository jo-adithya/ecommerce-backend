import { Schema, Prop } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id!: Types.ObjectId;
}
