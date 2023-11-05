import { Module } from "@nestjs/common";

import { ConfigModule } from "@nx-micro-ecomm/server/config";
import { DatabaseModule } from "@nx-micro-ecomm/server/database";
import { LoggerModule } from "@nx-micro-ecomm/server/logger";

import { Product, ProductSchema } from "../models/product.schema";
import { ProductsController } from "./products.controller";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

@Module({
	imports: [
		ConfigModule,
		LoggerModule,
		DatabaseModule,
		DatabaseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
	],
	controllers: [ProductsController],
	providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
