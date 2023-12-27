import { Module } from "@nestjs/common";

import { MongooseModule } from "@nx-micro-ecomm/server/mongoose";

import { Product, ProductSchema } from "./models/product.schema";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
