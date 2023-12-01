import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { AbstractDocument } from "@nx-micro-ecomm/server/database";

@Schema({ versionKey: false, timestamps: true })
export class Product extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  userId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
