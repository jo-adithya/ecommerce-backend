import { Injectable } from "@nestjs/common";

import { CreateProductDto } from "../dtos/create-product.dto";
import { UpdateProductDto } from "../dtos/update-product.dto";
import { ProductCreatedPublisherService } from "../nats/product-created-publisher.service";
import { ProductsRepository } from "./products.repository";

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productCreatedPublisher: ProductCreatedPublisherService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productsRepository.create({ ...createProductDto, userId: "1" });
    this.productCreatedPublisher.publish({
      id: product._id.toString(),
      title: product.title,
      price: product.price,
    });
    return product;
  }

  async findAll() {
    return this.productsRepository.find({});
  }

  async findOne(_id: string) {
    return this.productsRepository.findOne({ _id });
  }

  async update(_id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.findOneAndUpdate({ _id }, { $set: updateProductDto });
  }

  async delete(_id: string) {
    return this.productsRepository.findOneAndDelete({ _id });
  }

  getData(): { message: string } {
    return { message: "Hello API" };
  }
}
