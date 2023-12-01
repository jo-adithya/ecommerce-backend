import { Model } from "mongoose";

import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { AbstractRepository } from "@nx-micro-ecomm/server/database";

import { Product } from "../models/product.schema";

@Injectable()
export class ProductsRepository extends AbstractRepository<Product> {
  protected logger = new Logger(ProductsRepository.name);
  constructor(@InjectModel(Product.name) productModel: Model<Product>) {
    super(productModel);
  }
}
