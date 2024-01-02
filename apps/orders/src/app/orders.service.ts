import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

import { ordersConfig } from "@nx-micro-ecomm/server/config";
import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { Order } from "../models";
import { OrderCancelledPublisherService, OrderCreatedPublisherService } from "../nats/publishers";
import { ProductsService } from "../products";
import { CreateOrderDto } from "./dtos";
import { OrdersRepository } from "./orders.repository";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
    @Inject(ordersConfig.KEY) private readonly ordersConfiguration: ConfigType<typeof ordersConfig>,
    private readonly orderCreatedPublisherService: OrderCreatedPublisherService,
    private readonly orderCancelledPublisherService: OrderCancelledPublisherService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<Order> | never {
    // Find the product associated with the order
    const product = await this.productsService.getProductById({ id: createOrderDto.productId });

    // Make sure that the product has enough quantity available
    if (createOrderDto.quantity > product.quantity) {
      throw new BadRequestException("Product is out of stock");
    }

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

    // Decrease the quantity of the product
    await this.productsService.decreaseProductQuantity({
      id: product.id,
      quantity: createOrderDto.quantity,
    });

    // Publish an order created event
    this.orderCreatedPublisherService.publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      quantity: order.quantity,
      product: {
        id: product.id,
        price: product.price,
      },
      version: order.version,
    });

    return order;
  }

  async getAllOrders(userId: string): Promise<Order[]> {
    return this.ordersRepository.getAllOrders(userId);
  }

  async getOrderById(userId: string, orderId: string): Promise<Order> | never {
    return this.ordersRepository.getOrderById(userId, orderId);
  }

  async cancelOrder(orderId: string, options = { awaitPublish: false }): Promise<Order> | never {
    const order = await this.ordersRepository.cancelOrder(orderId);

    // Publish an order cancelled event
    if (options.awaitPublish) {
      await this.orderCancelledPublisherService.publish({
        id: order.id,
        quantity: order.quantity,
        product: {
          id: order.productId,
        },
        version: order.version,
      });
    } else {
      this.orderCancelledPublisherService.publish({
        id: order.id,
        quantity: order.quantity,
        product: {
          id: order.productId,
        },
        version: order.version,
      });
    }

    return order;
  }
}
