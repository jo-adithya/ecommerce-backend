import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

import { ordersConfig } from "@nx-micro-ecomm/server/config";
import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { Order, Product } from "../models";
import { ProductsService } from "../products";
import { CreateOrderDto } from "./dtos";
import { OrdersRepository } from "./orders.repository";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
    @Inject(ordersConfig.KEY) private readonly ordersConfiguration: ConfigType<typeof ordersConfig>,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<Order> | never {
    // Find the product associated with the order
    const product = await this.productsService.getProductById({ id: createOrderDto.productId });

    // Make sure that the product has enough quantity available
    await this.checkProductAvailability(product, createOrderDto.quantity);

    // Calculate the expiration date of the order (15 minutes)
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + this.ordersConfiguration.expirationSeconds);

    // Build the order and save it to the database
    const order = await this.ordersRepository.createOrder({
      userId,
      status: OrderStatus.Created,
      expiresAt: expiration,
      quantity: createOrderDto.quantity,
      productId: createOrderDto.productId,
    });

    // TODO: Publish an order created event

    return order;
  }

  async getAllOrders(userId: string): Promise<Order[]> {
    return this.ordersRepository.getAllOrders(userId);
  }

  async getOrderById(userId: string, orderId: string): Promise<Order> | never {
    return this.ordersRepository.getOrderById(userId, orderId);
  }

  async cancelOrder(userId: string, orderId: string): Promise<Order> | never {
    return this.ordersRepository.cancelOrder(userId, orderId);
  }

  async checkProductAvailability(product: Product, quantity: number) {
    const orders = await this.ordersRepository.getAllReservedOrdersByProductId(product.id);
    if (orders.reduce((acc, order) => acc + order.quantity, 0) + quantity > product.quantity) {
      throw new BadRequestException("Product is out of stock");
    }
  }
}
