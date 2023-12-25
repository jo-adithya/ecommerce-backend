import cookieParser from "cookie-parser";
import Joi from "joi";

import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";

import { natsConfig, ordersConfig } from "@nx-micro-ecomm/server/config";
import { DatabaseModule } from "@nx-micro-ecomm/server/database";
import { LoggerModule } from "@nx-micro-ecomm/server/logger";
import { NatsStreamingModule } from "@nx-micro-ecomm/server/nats-streaming";

import { ProductsModule } from "../products";
import { Order, OrderSchema } from "./models";
import { OrdersController } from "./orders.controller";
import { OrdersRepository } from "./orders.repository";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
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
        MONGODB_URI: Joi.string().required(),
        NATS_URL: Joi.string().required(),
        NATS_CLUSTER_ID: Joi.string().required(),
        NATS_CLIENT_ID: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      load: [natsConfig, ordersConfig],
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes("*");
  }
}
