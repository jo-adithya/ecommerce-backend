import { Types } from "mongoose";

import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { ordersConfig } from "@nx-micro-ecomm/server/config";
import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { ProductsService } from "../products";
import { OrdersRepository } from "./orders.repository";
import { OrdersService } from "./orders.service";

describe("OrdersService", () => {
  let service: OrdersService;

  const mockUserId = new Types.ObjectId().toString();
  const mockProduct = {
    _id: new Types.ObjectId(),
    title: "Test",
    price: 10,
    quantity: 1,
  };
  const mockOrder = { productId: mockProduct._id.toString(), quantity: 1 };
  const mockOutOfStockOrder = { productId: mockProduct._id.toString(), quantity: 2 };
  const mockOrdersRepository: Partial<jest.Mocked<OrdersRepository>> = {
    find: jest.fn(),
    create: jest.fn((document) => Promise.resolve({ ...document, _id: new Types.ObjectId() })),
    findOrdersByUserId: jest.fn(),
    findOrderById: jest.fn(),
    cancelOrder: jest.fn(),
  };
  const mockProductsService: Partial<jest.Mocked<ProductsService>> = {
    getProductById: jest.fn(),
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
      mockOrdersRepository.find.mockResolvedValueOnce([]);

      await expect(service.createOrder(mockUserId, mockOutOfStockOrder)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should successfully reserve a product", async () => {
      mockProductsService.getProductById.mockResolvedValueOnce(mockProduct);
      mockOrdersRepository.find.mockResolvedValueOnce([]);

      const order = await service.createOrder(mockUserId, mockOrder);

      expect(order._id).toBeDefined();
      expect(order.userId).toEqual(mockUserId);
      expect(order.status).toEqual(OrderStatus.Created);
      expect(order.expiresAt).toBeDefined();
      expect(order.quantity).toEqual(mockOrder.quantity);
    });
  });

  describe("getAllOrdersByUserId", () => {
    it("should return all orders for a user", async () => {
      mockOrdersRepository.findOrdersByUserId.mockResolvedValueOnce([
        {
          _id: new Types.ObjectId(),
          userId: mockUserId,
          status: OrderStatus.Created,
          expiresAt: new Date(),
          quantity: mockOrder.quantity,
          product: mockProduct,
        },
      ]);

      const orders = await service.getAllOrdersByUserId(mockUserId);

      expect(orders.length).toEqual(1);
      expect(orders[0].userId).toEqual(mockUserId);
    });

    it("should return an empty array if user has no order", async () => {
      mockOrdersRepository.findOrdersByUserId.mockResolvedValueOnce([]);

      const orders = await service.getAllOrdersByUserId(mockUserId);

      expect(orders).toEqual([]);
    });
  });

  describe("getOrderById", () => {
    it("should throw an error if order does not exist or user id is not valid", async () => {
      mockOrdersRepository.findOrderById.mockRejectedValueOnce(new NotFoundException());

      await expect(service.getOrderById(mockUserId, mockOrder.productId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should return an order if it exists", async () => {
      const mockOrderId = new Types.ObjectId();
      mockOrdersRepository.findOrderById.mockResolvedValueOnce({
        _id: mockOrderId,
        userId: mockUserId,
        status: OrderStatus.Created,
        expiresAt: new Date(),
        quantity: mockOrder.quantity,
        product: mockProduct,
      });

      const order = await service.getOrderById(mockUserId, mockOrder.productId);

      expect(order.userId).toEqual(mockUserId);
      expect(order._id.toString()).toEqual(mockOrderId.toString());
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
      const mockOrderId = new Types.ObjectId();
      mockOrdersRepository.cancelOrder.mockResolvedValueOnce({
        _id: mockOrderId,
        userId: mockUserId,
        status: OrderStatus.Cancelled,
        expiresAt: new Date(),
        quantity: mockOrder.quantity,
        product: mockProduct,
      });

      const order = await service.cancelOrder(mockUserId, mockOrder.productId);

      expect(order.userId).toEqual(mockUserId);
      expect(order._id.toString()).toEqual(mockOrderId.toString());
      expect(order.status).toEqual(OrderStatus.Cancelled);
    });
  });
});
