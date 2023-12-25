import { Types } from "mongoose";

import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

describe("OrdersController", () => {
  let controller: OrdersController;

  const mockUser = { id: new Types.ObjectId().toString(), email: "test@test.com" };
  const mockProduct = { id: new Types.ObjectId().toString(), title: "Test", price: 10 };
  const mockOrder = { productId: mockProduct.id, quantity: 1 };
  const mockOrdersService = {
    createOrder: jest.fn(),
  };

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile();

    controller = app.get<OrdersController>(OrdersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createOrder", () => {
    it("should throw an error if product does not exist", async () => {
      mockOrdersService.createOrder.mockRejectedValue(new NotFoundException());

      await expect(controller.createOrder(mockUser, mockOrder)).rejects.toThrow(NotFoundException);
    });

    it("should throw an error if product is out of stock", async () => {
      mockOrdersService.createOrder.mockRejectedValue(new BadRequestException());

      await expect(controller.createOrder(mockUser, mockOrder)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should successfully reserve a product", async () => {
      mockOrdersService.createOrder.mockResolvedValue({
        _id: new Types.ObjectId(),
        userId: mockUser.id,
        status: OrderStatus.Created,
        expiresAt: new Date().setSeconds(new Date().getSeconds() + 15 * 60),
        quantity: mockOrder.quantity,
        product: mockProduct,
      });

      const order = await controller.createOrder(mockUser, mockOrder);

      expect(order._id).toBeDefined();
      expect(order.userId).toEqual(mockUser.id);
      expect(order.status).toEqual(OrderStatus.Created);
      expect(order.expiresAt).toBeDefined();
      expect(order.quantity).toEqual(mockOrder.quantity);
    });
  });
});
