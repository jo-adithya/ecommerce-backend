import { Injectable } from "@nestjs/common";

import { CreateProductDto, GetProductByIdDto } from "./dtos";
import { ProductDocument } from "./models";
import { ProductsRepository } from "./products.repository";

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  createProduct(createProductDto: CreateProductDto): Promise<ProductDocument> | never {
    return this.productsRepository.create(createProductDto);
  }

  getProductById(getProductByIdDto: GetProductByIdDto): Promise<ProductDocument> | never {
    return this.productsRepository.findOne(getProductByIdDto);
  }
}
