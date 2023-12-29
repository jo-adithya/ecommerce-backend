import { Output, date, enum_, minValue, number, object, string } from "valibot";

import { OrderStatus } from "@nx-micro-ecomm/server/orders";

export const OrderSchema = object({
  id: string(),
  userId: string(),
  status: enum_(OrderStatus),
  expiresAt: date(),
  quantity: number([minValue(1)]),
  productId: string(),
  version: number(),
});

export type Order = Output<typeof OrderSchema>;
