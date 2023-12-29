import { Stan } from "node-nats-streaming";

import { Test, TestingModule } from "@nestjs/testing";

import { getNatsClientToken } from "@nx-micro-ecomm/server/nats-streaming";

import { ProductsService } from "../../products";
import { ProductUpdatedListenerService } from "./product-updated-listener.service";

describe("ProductUpdatedListenerService", () => {
  let service: ProductUpdatedListenerService;

  const mockNatsClient: Partial<jest.Mocked<Stan>> = {};
  const mockProductService: Partial<jest.Mocked<ProductsService>> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductUpdatedListenerService,
        { provide: getNatsClientToken(), useValue: mockNatsClient },
        { provide: ProductsService, useValue: mockProductService },
      ],
    }).compile();

    service = module.get<ProductUpdatedListenerService>(ProductUpdatedListenerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
