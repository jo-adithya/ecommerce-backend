import { Message, Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  InjectClient,
  ListenerService,
  OrderCreatedEvent,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

import { ProductsService } from "../../app/products.service";
import { queueGroupName } from "./constants";

@Injectable()
export class OrderCreatedListenerService extends ListenerService<OrderCreatedEvent> {
  constructor(
    @InjectClient() client: Stan,
    private readonly productsService: ProductsService,
  ) {
    super(client, { subject: Subject.OrderCreated, queueGroupName });
  }

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await this.productsService.createOrder({
      productId: data.product.id,
      orderId: data.id,
      quantity: data.quantity,
    });
    msg.ack();
  }
}
