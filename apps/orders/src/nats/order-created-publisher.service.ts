import { Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  InjectClient,
  OrderCreatedEvent,
  PublisherService,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

@Injectable()
export class OrderCreatedPublisherService extends PublisherService<OrderCreatedEvent> {
  constructor(@InjectClient() client: Stan) {
    super(client, { subject: Subject.OrderCreated });
  }
}
