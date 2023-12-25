import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

import { ordersConfig } from "@nx-micro-ecomm/server/config";
import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { ProductDocument, ProductsService } from "../products";
import { CreateOrderDto } from "./dtos";
import { OrderDocument } from "./models";
import { OrdersRepository } from "./orders.repository";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
    @Inject(ordersConfig.KEY) private readonly ordersConfiguration: ConfigType<typeof ordersConfig>,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderDocument> | never {
    // Find the product associated with the order
    const product = await this.productsService.getProductById({ _id: createOrderDto.productId });

    // Make sure that the product has enough quantity available
    await this.checkProductAvailability(product, createOrderDto.quantity);

    // Calculate the expiration date of the order (15 minutes)
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + this.ordersConfiguration.expirationSeconds);

    // Build the order and save it to the database
    const order = await this.ordersRepository.create({
      userId,
      status: OrderStatus.Created,
      expiresAt: expiration,
      quantity: createOrderDto.quantity,
      product,
    });

    // TODO: Publish an order created event

    return order;
  }

  async getAllOrdersByUserId(userId: string): Promise<OrderDocument[]> {
    return this.ordersRepository.findOrdersByUserId(userId);
  }

  async getOrderById(userId: string, orderId: string): Promise<OrderDocument> | never {
    return this.ordersRepository.findOrderById(userId, orderId);
  }

  async cancelOrder(userId: string, orderId: string): Promise<OrderDocument> | never {
    return this.ordersRepository.cancelOrder(userId, orderId);
  }

  async checkProductAvailability(product: ProductDocument, quantity: number) {
    const filterQuery = {
      product,
      status: {
        $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
      },
    };
    const orders = await this.ordersRepository.find(filterQuery);
    if (orders.reduce((acc, order) => acc + order.quantity, 0) + quantity > product.quantity) {
      throw new BadRequestException("Product is out of stock");
    }
  }
}
