import { Types } from "mongoose";

import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { ordersConfig } from "@nx-micro-ecomm/server/config";
import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { OrderCancelledPublisherService, OrderCreatedPublisherService } from "../nats";
import { ProductsService } from "../products";
import { OrdersRepository } from "./orders.repository";
import { OrdersService } from "./orders.service";

describe("OrdersService", () => {
  let service: OrdersService;

  const mockUserId = new Types.ObjectId().toString();
  const mockProduct = {
    id: "1",
    title: "Test",
    price: 10,
    quantity: 1,
  };
  const mockOrder = { productId: mockProduct.id, quantity: 1 };
  const mockOutOfStockOrder = { productId: mockProduct.id, quantity: 2 };
  const mockOrdersRepository: Partial<jest.Mocked<OrdersRepository>> = {
    createOrder: jest.fn((document) => Promise.resolve({ ...document, id: "1" })),
    getAllOrders: jest.fn(),
    getOrderById: jest.fn(),
    getAllReservedOrdersByProductId: jest.fn(),
    cancelOrder: jest.fn(),
  };
  const mockProductsService: Partial<jest.Mocked<ProductsService>> = {
    getProductById: jest.fn(),
  };
  const mockOrderCreatedPublisherService: Partial<jest.Mocked<OrderCreatedPublisherService>> = {
    publish: jest.fn(),
  };
  const mockOrderCancelledPublisherService: Partial<jest.Mocked<OrderCancelledPublisherService>> = {
    publish: jest.fn(),
  };
  const mockOrdersConfig = {
    expirationSeconds: 15 * 60,
  };

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: mockOrdersRepository },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ordersConfig.KEY, useValue: mockOrdersConfig },
        { provide: OrderCreatedPublisherService, useValue: mockOrderCreatedPublisherService },
        { provide: OrderCancelledPublisherService, useValue: mockOrderCancelledPublisherService },
      ],
    }).compile();

    service = app.get<OrdersService>(OrdersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createOrder", () => {
    it("should throw an error if product does not exist", async () => {
      mockProductsService.getProductById.mockRejectedValueOnce(new NotFoundException());

      await expect(service.createOrder(mockUserId, mockOrder)).rejects.toThrow(NotFoundException);
    });

    it("should throw an error if product is out of stock", async () => {
      mockProductsService.getProductById.mockResolvedValueOnce(mockProduct);
      mockOrdersRepository.getAllReservedOrdersByProductId.mockResolvedValueOnce([]);

      await expect(service.createOrder(mockUserId, mockOutOfStockOrder)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should successfully reserve a product", async () => {
      mockProductsService.getProductById.mockResolvedValueOnce(mockProduct);
      mockOrdersRepository.getAllReservedOrdersByProductId.mockResolvedValueOnce([]);

      const order = await service.createOrder(mockUserId, mockOrder);

      expect(order.id).toBeDefined();
      expect(order.userId).toEqual(mockUserId);
      expect(order.status).toEqual(OrderStatus.Created);
      expect(order.expiresAt).toBeDefined();
      expect(order.quantity).toEqual(mockOrder.quantity);
    });
  });

  describe("getAllOrders", () => {
    it("should return all orders for a user", async () => {
      mockOrdersRepository.getAllOrders.mockResolvedValueOnce([
        {
          id: "1",
          userId: mockUserId,
          status: OrderStatus.Created,
          expiresAt: new Date(),
          quantity: mockOrder.quantity,
          productId: mockProduct.id,
        },
      ]);

      const orders = await service.getAllOrders(mockUserId);

      expect(orders.length).toEqual(1);
      expect(orders[0].userId).toEqual(mockUserId);
      expect(mockOrderCreatedPublisherService.publish).toHaveBeenCalled();
    });

    it("should return an empty array if user has no order", async () => {
      mockOrdersRepository.getAllOrders.mockResolvedValueOnce([]);

      const orders = await service.getAllOrders(mockUserId);

      expect(orders).toEqual([]);
    });
  });

  describe("getOrderById", () => {
    it("should throw an error if order does not exist or user id is not valid", async () => {
      mockOrdersRepository.getOrderById.mockRejectedValueOnce(new NotFoundException());

      await expect(service.getOrderById(mockUserId, mockOrder.productId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should return an order if it exists", async () => {
      const mockOrderId = "123";
      mockOrdersRepository.getOrderById.mockResolvedValueOnce({
        id: mockOrderId,
        userId: mockUserId,
        status: OrderStatus.Created,
        expiresAt: new Date(),
        quantity: mockOrder.quantity,
        productId: mockProduct.id,
      });

      const order = await service.getOrderById(mockUserId, mockOrder.productId);

      expect(order.userId).toEqual(mockUserId);
      expect(order.id).toEqual(mockOrderId);
    });
  });

  describe("cancelOrder", () => {
    it("should throw an error if order does not exist or user id is not valid", async () => {
      mockOrdersRepository.cancelOrder.mockRejectedValueOnce(new NotFoundException());

      await expect(service.cancelOrder(mockUserId, mockOrder.productId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should return an order if it exists", async () => {
      const mockOrderId = "123";
      mockOrdersRepository.cancelOrder.mockResolvedValueOnce({
        id: mockOrderId,
        userId: mockUserId,
        status: OrderStatus.Cancelled,
        expiresAt: new Date(),
        quantity: mockOrder.quantity,
        productId: mockProduct.id,
      });

      const order = await service.cancelOrder(mockUserId, mockOrder.productId);

      expect(order.userId).toEqual(mockUserId);
      expect(order.id).toEqual(mockOrderId);
      expect(order.status).toEqual(OrderStatus.Cancelled);
      expect(mockOrderCancelledPublisherService.publish).toHaveBeenCalled();
    });
  });
});
