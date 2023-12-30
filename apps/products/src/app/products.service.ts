import { Injectable } from "@nestjs/common";

import { CreateProductDto, UpdateProductDto } from "../dtos";
import { ProductDocument } from "../models/product.schema";
import { ProductCreatedPublisherService, ProductUpdatedPublisherService } from "../nats";
import { ProductsRepository } from "./products.repository";

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productCreatedPublisher: ProductCreatedPublisherService,
    private readonly productUpdatedPublisher: ProductUpdatedPublisherService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> | never {
    const product = await this.productsRepository.create({ ...createProductDto, userId: "1" });
    this.productCreatedPublisher.publish({
      version: product.version,
      id: product._id.toString(),
      title: product.title,
      price: product.price,
      quantity: product.quantity,
    });
    return product;
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.productsRepository.find({});
  }

  async findOne(_id: string): Promise<ProductDocument> | never {
    return this.productsRepository.findOne({ _id });
  }

  async update(
    _id: string,
    updateProductDto: UpdateProductDto,
    flags = { orderCreated: false },
  ): Promise<ProductDocument> | never {
    const updatedProduct = await this.productsRepository.findOneAndUpdate(
      { _id },
      { $set: updateProductDto },
    );
    this.productUpdatedPublisher.publish({
      version: updatedProduct.version,
      id: updatedProduct._id.toString(),
      title: updatedProduct.title,
      price: updatedProduct.price,
      quantity: updatedProduct.quantity,
      orderCreated: flags.orderCreated,
    });
    return updatedProduct;
  }

  async delete(_id: string): Promise<ProductDocument> | never {
    return this.productsRepository.findOneAndDelete({ _id });
  }
}
