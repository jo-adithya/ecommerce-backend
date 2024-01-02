import Joi from "joi";

import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";

import { bullConfig, natsConfig } from "@nx-micro-ecomm/server/config";
import { LoggerModule } from "@nx-micro-ecomm/server/logger";
import { NatsStreamingModule } from "@nx-micro-ecomm/server/nats-streaming";

import { BullModule } from "../bull";
import { OrderCreatedListenerService } from "../nats/listeners";
import { ExpirationCompletePublisherService } from "../nats/publishers";

@Global()
@Module({
  imports: [
    BullModule,
    LoggerModule,
    NatsStreamingModule.forRootAsync({
      useFactory: (natsConfiguration: ConfigType<typeof natsConfig>) => ({
        url: natsConfiguration.url,
        clusterId: natsConfiguration.clusterId,
        clientId: natsConfiguration.clientId,
        onShutdown: () => {
          console.log("NATS connection closed!");
          process.exit();
        },
      }),
      inject: [natsConfig.KEY],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NATS_URL: Joi.string().required(),
        NATS_CLUSTER_ID: Joi.string().required(),
        NATS_CLIENT_ID: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
      }),
      load: [natsConfig, bullConfig],
    }),
  ],
  controllers: [],
  providers: [OrderCreatedListenerService, ExpirationCompletePublisherService],
})
export class ExpirationModule {}
