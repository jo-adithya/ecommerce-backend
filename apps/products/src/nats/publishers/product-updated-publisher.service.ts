import { Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  InjectClient,
  ProductUpdatedEvent,
  PublisherService,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

@Injectable()
export class ProductUpdatedPublisherService extends PublisherService<ProductUpdatedEvent> {
  constructor(@InjectClient() client: Stan) {
    super(client, { subject: Subject.ProductUpdated });
  }
}
