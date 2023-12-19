import { Stan } from "node-nats-streaming";

import { Test, TestingModule } from "@nestjs/testing";

import { Subject, getNatsClientToken } from "@nx-micro-ecomm/server/nats-streaming";

import { ProductUpdatedPublisherService } from "./product-updated-publisher.service";

describe("ProductUpdatedPublisherService", () => {
  let service: ProductUpdatedPublisherService;

  const mockNatsClient: Partial<Stan> = {
    publish: jest.fn((subject, data, callback) => {
      callback(undefined, "");
      return "";
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductUpdatedPublisherService,
        { provide: getNatsClientToken(), useValue: mockNatsClient },
      ],
    }).compile();

    service = module.get<ProductUpdatedPublisherService>(ProductUpdatedPublisherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("publish", () => {
    it("should publish a product updated event", () => {
      const mockProduct = {
        id: "123",
        title: "Product #1",
        price: 20,
      };

      service.publish(mockProduct);

      expect(mockNatsClient.publish).toHaveBeenCalledWith(
        Subject.ProductUpdated,
        JSON.stringify(mockProduct),
        expect.any(Function),
      );
    });
  });
});
