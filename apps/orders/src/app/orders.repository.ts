import { Kysely } from "kysely";

import { Injectable, Logger, NotFoundException } from "@nestjs/common";

import { InjectKysely } from "@nx-micro-ecomm/server/kysely";
import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { Database } from "../database";
import { Order } from "../models";

@Injectable()
export class OrdersRepository {
  private logger = new Logger(OrdersRepository.name);

  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async createOrder(order: Omit<Order, "id" | "version">): Promise<Order> | never {
    this.logger.debug(`Creating order: ${JSON.stringify(order)}`);
    return this.db.insertInto("order").values(order).returningAll().executeTakeFirst();
  }

  async getAllOrders(userId: string): Promise<Order[]> | never {
    this.logger.debug(`Finding orders by user id: ${userId}`);
    return this.db.selectFrom("order").selectAll().where("userId", "=", userId).execute();
  }

  async getOrderById(userId: string, orderId: string): Promise<Order> | never {
    this.logger.debug(`Finding order by order id: ${orderId}`);
    return this.db
      .selectFrom("order")
      .innerJoin("product", "order.productId", "product.id")
      .selectAll()
      .where("userId", "=", userId)
      .where("id", "=", orderId)
      .executeTakeFirstOrThrow(() => new NotFoundException("Order not found"));
  }

  async cancelOrder(userId: string, orderId: string): Promise<Order> | never {
    this.logger.debug(`Cancelling order by order id: ${orderId}`);
    return this.db
      .updateTable("order")
      .set({ status: OrderStatus.Cancelled })
      .where("id", "=", orderId)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException("Order not found"));
  }
}
