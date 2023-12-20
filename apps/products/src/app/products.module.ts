import cookieParser from "cookie-parser";
import Joi from "joi";

import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";

import { natsConfig } from "@nx-micro-ecomm/server/config";
import { DatabaseModule } from "@nx-micro-ecomm/server/database";
import { LoggerModule } from "@nx-micro-ecomm/server/logger";
import { NatsStreamingModule } from "@nx-micro-ecomm/server/nats-streaming";

import { Product, ProductSchema } from "../models/product.schema";
import { ProductCreatedPublisherService } from "../nats/product-created-publisher.service";
import { ProductUpdatedPublisherService } from "../nats/product-updated-publisher.service";
import { ProductsController } from "./products.controller";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    NatsStreamingModule.forRoot({
      clusterId: "ecomm",
      clientId: "products",
      url: "http://nats-svc:4222",
      onShutdown: () => {
        console.log("NATS connection closed!");
        process.exit();
      },
    }),
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
        MONGODB_URI: Joi.string().required(),
        NATS_URL: Joi.string().required(),
        NATS_CLUSTER_ID: Joi.string().required(),
        NATS_CLIENT_ID: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      load: [natsConfig],
    }),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    ProductCreatedPublisherService,
    ProductUpdatedPublisherService,
  ],
})
export class ProductsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes("*");
  }
}
