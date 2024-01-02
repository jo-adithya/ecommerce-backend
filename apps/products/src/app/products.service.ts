import { UpdateQuery } from "mongoose";

import { Injectable } from "@nestjs/common";

import { CancelOrderDto, CreateOrderDto, CreateProductDto } from "../dtos";
import { Product, ProductDocument } from "../models/product.schema";
import { ProductCreatedPublisherService, ProductUpdatedPublisherService } from "../nats/publishers";
import { ProductsRepository } from "./products.repository";

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productCreatedPublisher: ProductCreatedPublisherService,
    private readonly productUpdatedPublisher: ProductUpdatedPublisherService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> | never {
    const product = await this.productsRepository.create({
      ...createProductDto,
      userId: "1",
      orderIds: [],
    });
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
    updateQuery: UpdateQuery<Product>,
    flags = { orderCreated: false, awaitPublish: false },
  ): Promise<ProductDocument> | never {
    const updatedProduct = await this.productsRepository.findOneAndUpdate({ _id }, updateQuery);
    const publishData = {
      version: updatedProduct.version,
      id: updatedProduct._id.toString(),
      title: updatedProduct.title,
      price: updatedProduct.price,
      quantity: updatedProduct.quantity,
      orderCreated: flags.orderCreated,
    };
    if (flags.awaitPublish) {
      await this.productUpdatedPublisher.publish(publishData);
    } else {
      this.productUpdatedPublisher.publish(publishData);
    }
    return updatedProduct;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<ProductDocument> | never {
    return this.update(
      createOrderDto.productId,
      {
        $inc: { quantity: -createOrderDto.quantity },
        $push: { orderIds: createOrderDto.orderId },
      },
      { orderCreated: true, awaitPublish: true },
    );
  }

  async cancelOrder(cancelOrderDto: CancelOrderDto): Promise<ProductDocument> | never {
    return this.update(
      cancelOrderDto.productId,
      {
        $inc: { quantity: cancelOrderDto.quantity },
        $pull: { orderIds: cancelOrderDto.orderId },
      },
      { orderCreated: false, awaitPublish: true },
    );
  }

  async delete(_id: string): Promise<ProductDocument> | never {
    return this.productsRepository.findOneAndDelete({ _id });
  }
}
