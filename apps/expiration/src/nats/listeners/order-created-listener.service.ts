import { Message, Stan } from "node-nats-streaming";

import { Injectable } from "@nestjs/common";

import {
  InjectClient,
  ListenerService,
  OrderCreatedEvent,
  Subject,
} from "@nx-micro-ecomm/server/nats-streaming";

import { BullQueue, InjectQueue } from "../../bull";
import { queueGroupName } from "./constants";

@Injectable()
export class OrderCreatedListenerService extends ListenerService<OrderCreatedEvent> {
  constructor(
    @InjectClient() client: Stan,
    @InjectQueue() private readonly expirationQueue: BullQueue,
  ) {
    super(client, { subject: Subject.OrderCreated, queueGroupName });
  }

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const jobOptions = {
      delay: new Date(data.expiresAt).getTime() - new Date().getTime(),
    };

    await this.expirationQueue.add(
      {
        orderId: data.id,
      },
      jobOptions,
    );

    msg.ack();
  }
}
