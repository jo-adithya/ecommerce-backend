import Queue from "bull";

import { Global, Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

import { bullConfig } from "@nx-micro-ecomm/server/config";

import { ExpirationCompletePublisherService } from "../nats/publishers";
import { getBullQueueToken } from "./bull.constants";
import type { Payload } from "./bull.interface";
import { BullService } from "./bull.service";

@Global()
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
    BullService,
    ExpirationCompletePublisherService,
  ],
  exports: [getBullQueueToken()],
})
export class BullModule {}
