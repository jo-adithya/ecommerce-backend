import { Stan } from "node-nats-streaming";

import { Test, TestingModule } from "@nestjs/testing";

import { Subject, getNatsClientToken } from "@nx-micro-ecomm/server/nats-streaming";

import { OrderCancelledPublisherService } from "./order-cancelled-publisher.service";

describe("OrderCancelledPublisherService", () => {
  let service: OrderCancelledPublisherService;

  const mockNatsClient: Partial<jest.Mocked<Stan>> = {
    publish: jest.fn((subject, data, callback) => {
      callback(undefined, "");
      return "";
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderCancelledPublisherService,
        { provide: getNatsClientToken(), useValue: mockNatsClient },
      ],
    }).compile();

    service = module.get<OrderCancelledPublisherService>(OrderCancelledPublisherService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("publish", () => {
    it("should publish a order cancelled event", () => {
      const mockOrder = {
        id: "123",
        quantity: 1,
        version: 1,
        product: {
          id: "123",
        },
      };

      service.publish(mockOrder);

      expect(mockNatsClient.publish).toHaveBeenCalledWith(
        Subject.OrderCancelled,
        JSON.stringify(mockOrder),
        expect.any(Function),
      );
    });
  });
});
