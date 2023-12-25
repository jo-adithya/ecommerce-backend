import { Model } from "mongoose";

import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { AbstractRepository } from "@nx-micro-ecomm/server/database";
import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { Order, OrderDocument } from "./models";

@Injectable()
export class OrdersRepository extends AbstractRepository<Order> {
  logger = new Logger(OrdersRepository.name);

  constructor(@InjectModel(Order.name) model: Model<Order>) {
    super(model);
  }

  async findOrdersByUserId(userId: string): Promise<OrderDocument[]> | never {
    this.logger.debug(`Finding orders by user id: ${userId}`);
    return this.model.find({ userId }).populate("product").lean().exec();
  }

  async findOrderById(userId: string, orderId: string): Promise<OrderDocument> | never {
    this.logger.debug(`Finding order by order id: ${orderId}`);
    const filterQuery = { _id: orderId, userId };
    const order = await this.model.findOne(filterQuery).populate("product").lean().exec();
    this.assertDocumentExists(order, filterQuery);
    return order;
  }

  async cancelOrder(userId: string, orderId: string): Promise<OrderDocument> | never {
    this.logger.debug(`Cancelling order by order id: ${orderId}`);
    const filterQuery = { _id: orderId, userId };
    const updateQuery = { $set: { status: OrderStatus.Cancelled } };
    const updatedOrder = await this.model
      .findOneAndUpdate(filterQuery, updateQuery)
      .populate("product")
      .lean()
      .exec();
    this.assertDocumentExists(updatedOrder, filterQuery);
    return updatedOrder;
  }
}
