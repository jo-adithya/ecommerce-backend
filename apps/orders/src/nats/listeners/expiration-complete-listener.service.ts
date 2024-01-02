import { Message, Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  ExpirationCompleteEvent,
  InjectClient,
  ListenerService,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

import { OrdersService } from "../../app/orders.service";
import { queueGroupName } from "./constants";

@Injectable()
export class ExpirationCompleteListenerService extends ListenerService<ExpirationCompleteEvent> {
  constructor(
    @InjectClient() client: Stan,
    private readonly ordersService: OrdersService,
  ) {
    super(client, { subject: Subject.ExpirationComplete, queueGroupName });
  }

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    await this.ordersService.cancelOrder(data.orderId, { awaitPublish: true });
    msg.ack();
  }
}
