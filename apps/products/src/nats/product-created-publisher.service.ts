import { Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  AbstractPublisherService,
  InjectClient,
  ProductCreatedEvent,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

@Injectable()
export class ProductCreatedPublisherService extends AbstractPublisherService<ProductCreatedEvent> {
  constructor(@InjectClient() client: Stan) {
    super(client, { subject: Subject.ProductCreated });
  }
}
