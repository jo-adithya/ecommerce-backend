import { Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  InjectClient,
  OrderCancelledEvent,
  PublisherService,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

@Injectable()
export class OrderCancelledPublisherService extends PublisherService<OrderCancelledEvent> {
  constructor(@InjectClient() client: Stan) {
    super(client, { subject: Subject.OrderCancelled });
  }
}
