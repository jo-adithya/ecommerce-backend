import { Stan } from "node-nats-streaming";

import { Test, TestingModule } from "@nestjs/testing";

import { Subject, getNatsClientToken } from "@nx-micro-ecomm/server/nats-streaming";

import { ProductCreatedPublisherService } from "./product-created-publisher.service";

describe("ProductCreatedPublisherService", () => {
  let service: ProductCreatedPublisherService;

  const mockNatsClient: Partial<Stan> = {
    publish: jest.fn((subject, data, callback) => {
      callback(undefined, "");
      return "";
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCreatedPublisherService,
        { provide: getNatsClientToken(), useValue: mockNatsClient },
      ],
    }).compile();

    service = module.get<ProductCreatedPublisherService>(ProductCreatedPublisherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("publish", () => {
    it("should publish a product created event", () => {
      const mockProduct = {
        id: "123",
        title: "Product #1",
        price: 20,
        quantity: 1,
        version: 1,
        orderCreated: false,
      };

      service.publish(mockProduct);

      expect(mockNatsClient.publish).toHaveBeenCalledWith(
        Subject.ProductCreated,
        JSON.stringify(mockProduct),
        expect.any(Function),
      );
    });
  });
});
