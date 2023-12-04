import { Test, TestingModule } from "@nestjs/testing";

import { ProductCreatedPublisherService } from "./product-created-publisher.service";

describe("ProductCreatedPublisherService", () => {
  let service: ProductCreatedPublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCreatedPublisherService],
    }).compile();

    service = module.get<ProductCreatedPublisherService>(ProductCreatedPublisherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
