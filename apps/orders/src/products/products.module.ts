import { Module } from "@nestjs/common";

import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

@Module({
  imports: [],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
