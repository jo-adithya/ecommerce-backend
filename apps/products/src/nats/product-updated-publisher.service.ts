import { Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  AbstractPublisherService,
  InjectClient,
  ProductUpdatedEvent,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

@Injectable()
export class ProductUpdatedPublisherService extends AbstractPublisherService<ProductUpdatedEvent> {
  constructor(@InjectClient() client: Stan) {
    super(client, { subject: Subject.ProductUpdated });
  }
}
