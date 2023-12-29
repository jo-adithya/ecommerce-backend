import { Message, Stan } from "node-nats-streaming";

import { Test, TestingModule } from "@nestjs/testing";

import { ProductCreatedEvent, getNatsClientToken } from "@nx-micro-ecomm/server/nats-streaming";

import { ProductsService } from "../../products";
import { ProductCreatedListenerService } from "./product-created-listener.service";

describe("ProductCreatedListenerService", () => {
  let service: ProductCreatedListenerService;

  const mockNatsClient: Partial<jest.Mocked<Stan>> = {};
  const mockProductService: Partial<jest.Mocked<ProductsService>> = {
    createProduct: jest.fn(),
  };
  const mockMsg: Partial<jest.Mocked<Message>> = {
    ack: jest.fn(),
  };
  const mockEventData: ProductCreatedEvent["data"] = {
    version: 0,
    id: "1",
    title: "Product #1",
    price: 20,
    quantity: 1,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCreatedListenerService,
        { provide: getNatsClientToken(), useValue: mockNatsClient },
        { provide: ProductsService, useValue: mockProductService },
      ],
    }).compile();

    service = module.get<ProductCreatedListenerService>(ProductCreatedListenerService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("onMessage", () => {
    it("should attempt to create a product and acknowledge if successful", async () => {
      mockProductService.createProduct.mockResolvedValueOnce(mockEventData);
      await service.onMessage(mockEventData, mockMsg as Message);
      expect(mockProductService.createProduct).toHaveBeenCalledWith(mockEventData);
      expect(mockMsg.ack).toHaveBeenCalled();
    });

    it("should not acknowledge if product creation fails", async () => {
      mockProductService.createProduct.mockRejectedValueOnce(new Error());
      try {
        await service.onMessage(mockEventData, mockMsg as Message);
      } catch (e) {
        expect(e).toBeDefined();
      }
      expect(mockProductService.createProduct).toHaveBeenCalledWith(mockEventData);
      expect(mockMsg.ack).not.toHaveBeenCalled();
    });
  });
});
