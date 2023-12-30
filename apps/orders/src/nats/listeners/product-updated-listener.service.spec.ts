import { Message, Stan } from "node-nats-streaming";

import { Test, TestingModule } from "@nestjs/testing";

import { ProductUpdatedEvent, getNatsClientToken } from "@nx-micro-ecomm/server/nats-streaming";

import { ProductsService } from "../../products";
import { ProductUpdatedListenerService } from "./product-updated-listener.service";

describe("ProductUpdatedListenerService", () => {
  let service: ProductUpdatedListenerService;

  const mockNatsClient: Partial<jest.Mocked<Stan>> = {};
  const mockProductService: Partial<jest.Mocked<ProductsService>> = {
    updateProductByEvent: jest.fn(),
    updateProductVersion: jest.fn(),
  };
  const mockMsg: Partial<jest.Mocked<Message>> = {
    ack: jest.fn(),
  };
  const mockEventData: ProductUpdatedEvent["data"] = {
    version: 0,
    id: "1",
    title: "Product #1",
    price: 20,
    quantity: 1,
    orderCreated: false,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductUpdatedListenerService,
        { provide: getNatsClientToken(), useValue: mockNatsClient },
        { provide: ProductsService, useValue: mockProductService },
      ],
    }).compile();

    service = module.get<ProductUpdatedListenerService>(ProductUpdatedListenerService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("onMessage", () => {
    it("should attempt to update a product and acknowledge if successful", async () => {
      mockProductService.updateProductByEvent.mockResolvedValueOnce(mockEventData);
      await service.onMessage(mockEventData, mockMsg as Message);
      expect(mockProductService.updateProductByEvent).toHaveBeenCalledWith(mockEventData);
      expect(mockProductService.updateProductVersion).not.toHaveBeenCalled();
      expect(mockMsg.ack).toHaveBeenCalled();
    });

    it("should attempt to only update a product version if orderCreated flag is true", async () => {
      mockProductService.updateProductVersion.mockResolvedValueOnce(mockEventData);
      await service.onMessage({ ...mockEventData, orderCreated: true }, mockMsg as Message);
      expect(mockProductService.updateProductByEvent).not.toHaveBeenCalled();
      expect(mockProductService.updateProductVersion).toHaveBeenCalledWith({
        id: mockEventData.id,
        version: mockEventData.version,
      });
      expect(mockMsg.ack).toHaveBeenCalled();
    });

    it("should not acknowledge if product update fails", async () => {
      mockProductService.updateProductByEvent.mockRejectedValueOnce(new Error());
      try {
        await service.onMessage(mockEventData, mockMsg as Message);
      } catch (e) {
        expect(e).toBeDefined();
      }
      expect(mockProductService.updateProductByEvent).toHaveBeenCalledWith(mockEventData);
      expect(mockMsg.ack).not.toHaveBeenCalled();
    });
  });
});
