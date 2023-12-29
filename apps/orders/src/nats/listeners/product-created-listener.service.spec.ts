import { Test, TestingModule } from "@nestjs/testing";

import { ProductCreatedListenerService } from "./product-created-listener.service";

describe("ProductCreatedListenerService", () => {
  let service: ProductCreatedListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCreatedListenerService],
    }).compile();

    service = module.get<ProductCreatedListenerService>(ProductCreatedListenerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
