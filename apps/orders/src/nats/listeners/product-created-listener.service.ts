import { Message, Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  InjectClient,
  ListenerService,
  ProductCreatedEvent,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

import { ProductsService } from "../../products";
import { queueGroupName } from "./constants";

@Injectable()
export class ProductCreatedListenerService extends ListenerService<ProductCreatedEvent> {
  constructor(
    @InjectClient() client: Stan,
    private readonly productService: ProductsService,
  ) {
    super(client, { subject: Subject.ProductCreated, queueGroupName });
  }

  onMessage(data: ProductCreatedEvent["data"], msg: Message): void {
    this.productService.createProduct(data);
    msg.ack();
  }
}
