import { Module } from "@nestjs/common";

import { DatabaseModule } from "@nx-micro-ecomm/server/database";

import { Product, ProductSchema } from "./models/product.schema";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

@Module({
  imports: [DatabaseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
