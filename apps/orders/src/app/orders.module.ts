import cookieParser from "cookie-parser";
import Joi from "joi";
import * as path from "path";

import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";

import { natsConfig, ordersConfig, postgresConfig } from "@nx-micro-ecomm/server/config";
import { KyselyModule } from "@nx-micro-ecomm/server/kysely";
import { LoggerModule } from "@nx-micro-ecomm/server/logger";
import { NatsStreamingModule } from "@nx-micro-ecomm/server/nats-streaming";

import {
  ExpirationCompleteListenerService,
  ProductCreatedListenerService,
  ProductUpdatedListenerService,
} from "../nats/listeners";
import { OrderCancelledPublisherService, OrderCreatedPublisherService } from "../nats/publishers";
import { ProductsModule } from "../products";
import { OrdersController } from "./orders.controller";
import { OrdersRepository } from "./orders.repository";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    LoggerModule,
    KyselyModule.forRoot({
      migrationFolder: path.join(__dirname, "db/migrations"),
    }),
    ProductsModule,
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
        EXPIRATION_WINDOW_SECONDS: Joi.number().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_NAME: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        NATS_URL: Joi.string().required(),
        NATS_CLUSTER_ID: Joi.string().required(),
        NATS_CLIENT_ID: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      load: [natsConfig, ordersConfig, postgresConfig],
    }),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    OrderCreatedPublisherService,
    OrderCancelledPublisherService,
    ProductCreatedListenerService,
    ProductUpdatedListenerService,
    ExpirationCompleteListenerService,
  ],
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes("*");
  }
}
