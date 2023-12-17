import { Injectable } from "@nestjs/common";

import { CreateProductDto, UpdateProductDto } from "../dtos";
import { ProductCreatedPublisherService, ProductUpdatedPublisherService } from "../nats";
import { ProductsRepository } from "./products.repository";

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productCreatedPublisher: ProductCreatedPublisherService,
    private readonly productUpdatedPublisher: ProductUpdatedPublisherService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productsRepository.create({ ...createProductDto, userId: "1" });
    this.productCreatedPublisher.publish({ ...product, id: product._id.toString() });
    return product;
  }

  async findAll() {
    return this.productsRepository.find({});
  }

  async findOne(_id: string) {
    return this.productsRepository.findOne({ _id });
  }

  async update(_id: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productsRepository.findOneAndUpdate(
      { _id },
      { $set: updateProductDto },
    );
    this.productUpdatedPublisher.publish({ ...updatedProduct, id: updatedProduct._id.toString() });
    return updatedProduct;
  }

  async delete(_id: string) {
    return this.productsRepository.findOneAndDelete({ _id });
  }

  getData(): { message: string } {
    return { message: "Hello API" };
  }
}
