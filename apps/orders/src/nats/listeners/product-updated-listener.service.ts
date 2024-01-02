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
    if (data.orderCreated) {
      await this.productsService.updateProductVersion({ id: data.id, version: data.version });
    } else {
      await this.productsService.updateProductByEvent({
        id: data.id,
        title: data.title,
        price: data.price,
        version: data.version,
        quantity: data.quantity,
      });
    }
    msg.ack();
  }
}
