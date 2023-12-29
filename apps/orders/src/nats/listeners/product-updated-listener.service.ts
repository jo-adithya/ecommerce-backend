import { Message, Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  InjectClient,
  ListenerService,
  ProductUpdatedEvent,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

import { ProductsService } from "../../products";
import { queueGroupName } from "./constants";

@Injectable()
export class ProductUpdatedListenerService extends ListenerService<ProductUpdatedEvent> {
  constructor(
    @InjectClient() client: Stan,
    private readonly productsService: ProductsService,
  ) {
    super(client, { subject: Subject.ProductUpdated, queueGroupName });
  }

  async onMessage(data: ProductUpdatedEvent["data"], msg: Message) {
    await this.productsService.updateProductByEvent(data);
    msg.ack();
  }
}
