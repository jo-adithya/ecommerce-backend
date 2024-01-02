import { Injectable, OnModuleInit } from "@nestjs/common";

import { ExpirationCompletePublisherService } from "../nats/publishers";
import { InjectQueue } from "./bull.constants";
import { BullQueue } from "./bull.interface";

@Injectable()
export class BullService implements OnModuleInit {
  constructor(
    @InjectQueue() private readonly queue: BullQueue,
    private readonly expirationCompletePublisher: ExpirationCompletePublisherService,
  ) {}

  onModuleInit() {
    this.queue.process(async (job) => {
      this.expirationCompletePublisher.publish({
        orderId: job.data.orderId,
      });
    });
  }
}
