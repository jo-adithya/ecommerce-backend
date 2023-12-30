import { Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  InjectClient,
  ProductCreatedEvent,
  PublisherService,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

@Injectable()
export class ProductCreatedPublisherService extends PublisherService<ProductCreatedEvent> {
  constructor(@InjectClient() client: Stan) {
    super(client, { subject: Subject.ProductCreated });
  }
}
