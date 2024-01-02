import { Message, Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  InjectClient,
  ListenerService,
  OrderCancelledEvent,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

import { ProductsService } from "../../app/products.service";
import { queueGroupName } from "./constants";

@Injectable()
export class OrderCancelledListenerService extends ListenerService<OrderCancelledEvent> {
  constructor(
    @InjectClient() client: Stan,
    private readonly productsService: ProductsService,
  ) {
    super(client, { subject: Subject.OrderCancelled, queueGroupName });
  }

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    await this.productsService.cancelOrder({
      productId: data.product.id,
      orderId: data.id,
      quantity: data.quantity,
    });
    msg.ack();
  }
}
