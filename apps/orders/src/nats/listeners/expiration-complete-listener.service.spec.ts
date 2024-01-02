import { Message, Stan } from "node-nats-streaming";

import { Test, TestingModule } from "@nestjs/testing";

import { getNatsClientToken } from "@nx-micro-ecomm/server/nats-streaming";

import { OrdersService } from "../../app/orders.service";
import { ExpirationCompleteListenerService } from "./expiration-complete-listener.service";

describe("ExpirationCompleteListenerService", () => {
  let service: ExpirationCompleteListenerService;

  const mockNatsClient: Partial<jest.Mocked<Stan>> = {};
  const mockOrdersService: Partial<jest.Mocked<OrdersService>> = {
    cancelOrder: jest.fn(),
  };
  const mockData = {
    orderId: "1",
  };
  const mockMsg: Partial<jest.Mocked<Message>> = {
    ack: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpirationCompleteListenerService,
        { provide: getNatsClientToken(), useValue: mockNatsClient },
        { provide: OrdersService, useValue: mockOrdersService },
      ],
    }).compile();

    service = module.get<ExpirationCompleteListenerService>(ExpirationCompleteListenerService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("onMessage", () => {
    it("should attempt to cancel the order", async () => {
      await service.onMessage(mockData, mockMsg as Message);

      expect(mockOrdersService.cancelOrder).toHaveBeenCalledWith(mockData.orderId, {
        awaitPublish: true,
      });
    });

    it("should acknowledge the message if succesful", async () => {
      await service.onMessage(mockData, mockMsg as Message);

      expect(mockMsg.ack).toHaveBeenCalled();
    });

    it("should not acknowledge the message if an error occurs", async () => {
      mockOrdersService.cancelOrder.mockRejectedValueOnce(new Error());

      try {
        await service.onMessage(mockData, mockMsg as Message);
      } catch (e) {
        // pass
      }
      expect(mockMsg.ack).not.toHaveBeenCalled();
    });
  });
});
