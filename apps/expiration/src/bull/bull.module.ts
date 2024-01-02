import Queue from "bull";

import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

import { bullConfig } from "@nx-micro-ecomm/server/config";

import { ExpirationCompletePublisherService } from "../nats/publishers/expiration-complete-publisher.service";
import { InjectQueue, getBullQueueToken } from "./bull.constants";
import type { BullQueue, Payload } from "./bull.interface";

@Module({
  providers: [
    {
      provide: getBullQueueToken(),
      useFactory: (bullConfiguration: ConfigType<typeof bullConfig>) => {
        return new Queue<Payload>("order:expiration", {
          redis: {
            host: bullConfiguration.host,
          },
        });
      },
      inject: [bullConfig.KEY],
    },
  ],
  exports: [getBullQueueToken()],
})
export class BullModule implements OnModuleInit {
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
