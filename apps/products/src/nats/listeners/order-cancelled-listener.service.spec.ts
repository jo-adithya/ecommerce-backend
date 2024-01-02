import { Message, Stan } from "node-nats-streaming";

import { Test, TestingModule } from "@nestjs/testing";

import { OrderCancelledEvent, getNatsClientToken } from "@nx-micro-ecomm/server/nats-streaming";

import { ProductsService } from "../../app/products.service";
import { OrderCancelledListenerService } from "./order-cancelled-listener.service";

describe("OrderCancelledListenerService", () => {
  let service: OrderCancelledListenerService;

  const mockNatsClient: Partial<jest.Mocked<Stan>> = {};
  const mockProductsService: Partial<jest.Mocked<ProductsService>> = {
    cancelOrder: jest.fn(),
  };

  const mockEventData: OrderCancelledEvent["data"] = {
    version: 0,
    id: "order1",
    quantity: 2,
    product: { id: "product1" },
  };
  const mockMsg: Partial<jest.Mocked<Message>> = {
    ack: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderCancelledListenerService,
        { provide: getNatsClientToken(), useValue: mockNatsClient },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<OrderCancelledListenerService>(OrderCancelledListenerService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("onMessage", () => {
    it("should call the cancel order method and acknowledge msg if successful", async () => {
      mockProductsService.cancelOrder.mockResolvedValueOnce({} as any);
      await service.onMessage(mockEventData, mockMsg as Message);
      expect(mockProductsService.cancelOrder).toHaveBeenCalledWith({
        productId: mockEventData.product.id,
        orderId: mockEventData.id,
        quantity: mockEventData.quantity,
      });
      expect(mockMsg.ack).toHaveBeenCalled();
    });

    it("should not acknowledge if order creation fails", async () => {
      mockProductsService.cancelOrder.mockRejectedValueOnce(new Error());
      try {
        await service.onMessage(mockEventData, mockMsg as Message);
      } catch (e) {
        expect(e).toBeDefined();
      }
      expect(mockMsg.ack).not.toHaveBeenCalled();
    });
  });
});
