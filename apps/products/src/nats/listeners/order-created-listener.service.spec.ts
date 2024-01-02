import { Message, Stan } from "node-nats-streaming";

import { Test, TestingModule } from "@nestjs/testing";

import { OrderCreatedEvent, getNatsClientToken } from "@nx-micro-ecomm/server/nats-streaming";
import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { ProductsService } from "../../app/products.service";
import { OrderCreatedListenerService } from "./order-created-listener.service";

describe("OrderCreatedListenerService", () => {
  let service: OrderCreatedListenerService;

  const mockNatsClient: Partial<jest.Mocked<Stan>> = {};
  const mockProductsService: Partial<jest.Mocked<ProductsService>> = {
    createOrder: jest.fn(),
  };

  const mockEventData: OrderCreatedEvent["data"] = {
    version: 0,
    id: "order1",
    status: OrderStatus.Created,
    userId: "user1",
    expiresAt: "",
    quantity: 2,
    product: { id: "product1", price: 20 },
  };
  const mockMsg: Partial<jest.Mocked<Message>> = {
    ack: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderCreatedListenerService,
        { provide: getNatsClientToken(), useValue: mockNatsClient },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<OrderCreatedListenerService>(OrderCreatedListenerService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("onMessage", () => {
    it("should call the create order method and acknowledge msg if successful", async () => {
      mockProductsService.createOrder.mockResolvedValueOnce({} as any);
      await service.onMessage(mockEventData, mockMsg as Message);
      expect(mockProductsService.createOrder).toHaveBeenCalledWith({
        productId: mockEventData.product.id,
        orderId: mockEventData.id,
        quantity: mockEventData.quantity,
      });
      expect(mockMsg.ack).toHaveBeenCalled();
    });

    it("should not acknowledge if order creation fails", async () => {
      mockProductsService.createOrder.mockRejectedValueOnce(new Error());
      try {
        await service.onMessage(mockEventData, mockMsg as Message);
      } catch (e) {
        expect(e).toBeDefined();
      }
      expect(mockMsg.ack).not.toHaveBeenCalled();
    });
  });
});
