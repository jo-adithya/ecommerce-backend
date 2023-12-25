import { Expose } from "class-transformer";

import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { Product } from "../../products";

export class OrderDto {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  userId: string;

  @Expose()
  status: OrderStatus;

  @Expose()
  expiresAt: Date;

  @Expose()
  product: Product;

  @Expose()
  quantity: number;
}
