import { FlattenMaps, SchemaTypes } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { AbstractDocument } from "@nx-micro-ecomm/server/mongoose";
import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { Product } from "../../products";

export type OrderDocument = FlattenMaps<Order>;

@Schema({ timestamps: true, versionKey: false })
export class Order extends AbstractDocument {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  })
  status: OrderStatus;

  @Prop({ type: SchemaTypes.Date })
  expiresAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Product" })
  product: Product;

  @Prop({ required: true, min: 0, default: 1 })
  quantity: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
