import { FlattenMaps } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { AbstractDocument } from "@nx-micro-ecomm/server/mongoose";

export type ProductDocument = FlattenMaps<Product>;

@Schema({ versionKey: "version", timestamps: true })
export class Product extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop()
  version: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre("findOneAndUpdate", function (next) {
  this.findOneAndUpdate(this.getFilter(), { $inc: { version: 1 } });
  return next();
});

ProductSchema.pre("updateMany", function (next) {
  this.updateMany(this.getFilter(), { $inc: { version: 1 } });
  return next();
});
