import { Stan } from "node-nats-streaming";

import { Test, TestingModule } from "@nestjs/testing";

import { Subject, getNatsClientToken } from "@nx-micro-ecomm/server/nats-streaming";
import { OrderStatus } from "@nx-micro-ecomm/server/orders";

import { OrderCreatedPublisherService } from "./order-created-publisher.service";

describe("OrderCreatedPublisherService", () => {
  let service: OrderCreatedPublisherService;

  const mockNatsClient: Partial<jest.Mocked<Stan>> = {
    publish: jest.fn((subject, data, callback) => {
      callback(undefined, "");
      return "";
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderCreatedPublisherService,
        { provide: getNatsClientToken(), useValue: mockNatsClient },
      ],
    }).compile();

    service = module.get<OrderCreatedPublisherService>(OrderCreatedPublisherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("publish", () => {
    it("should publish a order created event", () => {
      const mockOrder = {
        id: "123",
        status: OrderStatus.Created,
        userId: "123",
        expiresAt: "",
        quantity: 1,
        product: {
          id: "123",
          price: 10,
        },
      };

      service.publish(mockOrder);

      expect(mockNatsClient.publish).toHaveBeenCalledWith(
        Subject.OrderCreated,
        JSON.stringify(mockOrder),
        expect.any(Function),
      );
    });
  });
});
