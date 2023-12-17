import { Test, TestingModule } from "@nestjs/testing";

import { ProductUpdatedPublisherService } from "./product-updated-publisher.service";

describe("ProductUpdatedPublisherService", () => {
  let service: ProductUpdatedPublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductUpdatedPublisherService],
    }).compile();

    service = module.get<ProductUpdatedPublisherService>(ProductUpdatedPublisherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
