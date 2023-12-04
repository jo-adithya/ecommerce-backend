import cookieParser from "cookie-parser";
import Joi from "joi";

import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "@nx-micro-ecomm/server/database";
import { LoggerModule } from "@nx-micro-ecomm/server/logger";
import { NatsStreamingModule } from "@nx-micro-ecomm/server/nats-streaming";

import { Product, ProductSchema } from "../models/product.schema";
import { ProductCreatedPublisherService } from "../nats/product-created-publisher.service";
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
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, ProductCreatedPublisherService],
})
export class ProductsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes("*");
  }
}
