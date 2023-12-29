import { Injectable } from "@nestjs/common";

import { Product } from "../models";
import { CreateProductDto, GetProductByIdDto } from "./dtos";
import { UpdateProductDto } from "./dtos/update-product-dto";
import { ProductsRepository } from "./products.repository";

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  createProduct(createProductDto: CreateProductDto): Promise<Product> | never {
    return this.productsRepository.createProduct(createProductDto);
  }

  getProductById(getProductByIdDto: GetProductByIdDto): Promise<Product> | never {
    return this.productsRepository.getProductById(getProductByIdDto);
  }

  updateProduct(updateProductDto: UpdateProductDto): Promise<Product> | never {
    return this.productsRepository.updateProduct(updateProductDto);
  }
}
