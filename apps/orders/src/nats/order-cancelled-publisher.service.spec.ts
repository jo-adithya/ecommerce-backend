import { Test, TestingModule } from "@nestjs/testing";

import { OrderCancelledPublisherService } from "./order-cancelled-publisher.service";

describe("OrderCancelledPublisherService", () => {
  let service: OrderCancelledPublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderCancelledPublisherService],
    }).compile();

    service = module.get<OrderCancelledPublisherService>(OrderCancelledPublisherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
