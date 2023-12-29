import { Test, TestingModule } from "@nestjs/testing";

import { OrderCreatedPublisherService } from "./order-created-publisher.service";

describe("OrderCreatedPublisherService", () => {
  let service: OrderCreatedPublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderCreatedPublisherService],
    }).compile();

    service = module.get<OrderCreatedPublisherService>(OrderCreatedPublisherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
