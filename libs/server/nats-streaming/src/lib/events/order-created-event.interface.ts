import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { Subject } from "./subject.interface";

export interface OrderCreatedEvent {
  subject: Subject.OrderCreated;
  data: {
    version: number;
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    quantity: number;
    product: {
      id: string;
      price: number;
    };
  };
}
