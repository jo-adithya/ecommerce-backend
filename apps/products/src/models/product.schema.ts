import { FlattenMaps } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { AbstractDocument } from "@nx-micro-ecomm/server/database";

export type ProductDocument = FlattenMaps<Product>;

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
